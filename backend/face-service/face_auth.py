import base64
import cv2
import numpy as np
import requests
from deepface import DeepFace
from PIL import Image
from io import BytesIO
import urllib.parse

print("🚀 Loading face model...")

# Warmup model (important for speed)
_ = DeepFace.represent(
    img_path=np.zeros((100, 100, 3), dtype=np.uint8),
    model_name="Facenet",
    detector_backend="skip"
)

print("✅ Model loaded")

def base64_to_image(image_base64):
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    img_bytes = base64.b64decode(image_base64)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)

    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("Live image decoding failed")

    frame = cv2.resize(frame, (640, 480))

    # Ensure 3 channels
    if len(frame.shape) == 3 and frame.shape[2] == 4:
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

    return frame


# ============================
# URL → OpenCV image
# ============================
def url_to_image(image_url):
    image_url = urllib.parse.quote(image_url, safe=":/")

    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content)).convert("RGB")

    img = np.array(img)
    img = cv2.resize(img, (640, 480))

    # Ensure 3 channels
    if len(img.shape) == 3 and img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

    return img


# ============================
# MAIN FUNCTION (used everywhere)
# ============================
def verify_face_from_base64(stored_image_url, live_image_base64):
    try:
        img1 = url_to_image(stored_image_url)
        img2 = base64_to_image(live_image_base64)

        result = DeepFace.verify(
            img1_path=img1,
            img2_path=img2,
            model_name="Facenet",   # ⚠️ lighter than Facenet512
            detector_backend="opencv",
            enforce_detection=False,
            distance_metric="cosine"
        )

        distance = float(result["distance"])
        threshold = 0.60

        return {
            "success": distance < threshold,
            "distance": distance,
            "threshold": threshold
        }

    except Exception as e:
        print("FACE ERROR:", str(e))

        return {
            "success": False,
            "message": "Face verification failed"
        }