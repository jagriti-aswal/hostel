import os
import cv2
import base64
import numpy as np
import tempfile
from deepface import DeepFace

# =====================================================
# PATHS
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
HAAR_CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

os.makedirs(DATASET_DIR, exist_ok=True)

# =====================================================
# LOAD MODELS ONCE
# =====================================================

print("🚀 Loading face models...")

FACE_DETECTOR = cv2.CascadeClassifier(HAAR_CASCADE_PATH)

# Warm up model once
_ = DeepFace.represent(
    img_path=np.zeros((100, 100, 3), dtype=np.uint8),
    model_name="Facenet",
    detector_backend="skip"
)

print("✅ Models loaded")

# =====================================================
# PREPROCESS
# =====================================================

def preprocess_frame(frame):
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    lab = cv2.merge((l, a, b))
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

# =====================================================
# BASE64 → IMAGE
# =====================================================

def base64_to_image(image_base64: str):

    if not image_base64:
        raise ValueError("Empty base64 string")

    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    img_bytes = base64.b64decode(image_base64)

    if not img_bytes:
        raise ValueError("Decoded bytes empty")

    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("Image decode failed")

    return frame

# =====================================================
# SIGNUP
# =====================================================

def save_signup_image_from_base64(username, image_base64, image_index):

    try:
        user_dir = os.path.join(DATASET_DIR, username)
        os.makedirs(user_dir, exist_ok=True)

        frame = base64_to_image(image_base64)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = FACE_DETECTOR.detectMultiScale(gray, 1.1, 5, minSize=(100, 100))

        if len(faces) == 0:
            return {"success": False, "message": "No face detected"}

        if len(faces) > 1:
            return {"success": False, "message": "Multiple faces detected"}

        processed = preprocess_frame(frame)

        path = os.path.join(user_dir, f"{image_index}.jpg")
        cv2.imwrite(path, processed)

        return {"success": True}

    except Exception as e:
        return {"success": False, "message": str(e)}

# =====================================================
# LOGIN (Windows-safe temp handling)
# =====================================================

def verify_face_from_base64(username, image_base64, threshold=0.6):

    try:
        user_dir = os.path.join(DATASET_DIR, username)

        if not os.path.exists(user_dir):
            return {"success": False, "message": "User not registered"}

        frame = base64_to_image(image_base64)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = FACE_DETECTOR.detectMultiScale(gray, 1.1, 5, minSize=(100, 100))

        if len(faces) != 1:
            return {"success": False, "message": "Exactly one face required"}

        processed_input = preprocess_frame(frame)

        matches = 0
        total = 0

        # 🔥 Windows-safe temp path
        temp_path = os.path.join(BASE_DIR, "temp_verify.jpg")
        cv2.imwrite(temp_path, processed_input)

        for file in os.listdir(user_dir):

            stored_path = os.path.join(user_dir, file)

            try:
                result = DeepFace.verify(
                    img1_path=temp_path,
                    img2_path=stored_path,
                    model_name="Facenet",
                    enforce_detection=False
                )

                total += 1

                if result["verified"]:
                    matches += 1

            except Exception:
                continue

        # Safe delete
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

        if total == 0:
            return {"success": False, "message": "No stored images"}

        confidence = matches / total

        return {
            "success": confidence >= threshold,
            "confidence": round(confidence, 2)
        }

    except Exception as e:
        return {"success": False, "message": str(e)}
