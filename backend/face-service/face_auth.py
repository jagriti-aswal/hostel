import base64
import cv2
import numpy as np
from deepface import DeepFace
from flask import Flask, request, jsonify

app = Flask(__name__)

print("🚀 Loading face models...")

# Warm up model once (important for performance)
_ = DeepFace.represent(
    img_path=np.zeros((100, 100, 3), dtype=np.uint8),
    model_name="Facenet",
    detector_backend="skip"
)

print("✅ Models loaded")


# ===============================
# Base64 → OpenCV Image
# ===============================
def base64_to_image(image_base64):
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    img_bytes = base64.b64decode(image_base64)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    frame = cv2.resize(frame, (640, 480))
    if frame is None:
        raise ValueError("Image decoding failed")

    return frame


# ===============================
# Verify Face Route
# ===============================
@app.route("/verify-face", methods=["POST"])
def verify_face():
    try:
        data = request.json
        stored_image = data.get("stored_image")
        live_image = data.get("live_image")

        if not stored_image or not live_image:
            return jsonify({
                "success": False,
                "message": "Both images required"
            })

        img1 = base64_to_image(stored_image)
        img2 = base64_to_image(live_image)

        # 🔥 Face Verification
        result = DeepFace.verify(
    img1_path=img1,
    img2_path=img2,
    model_name="Facenet",
    detector_backend="retinaface",
    enforce_detection=True,
    distance_metric="cosine"
)

        # 🔥 Custom threshold (you can tune this)
        custom_threshold = 0.55

        is_match = result["distance"] < custom_threshold

        return jsonify({
            "success": is_match,
            "distance": float(result["distance"]),
            "threshold": custom_threshold
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Face not detected"
        })


# ===============================
# Run Server
# ===============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)