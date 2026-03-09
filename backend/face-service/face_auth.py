# import base64
# import cv2
# import numpy as np
# import urllib.parse
# import requests
# from deepface import DeepFace
# from flask import Flask, request, jsonify
# import requests
# from PIL import Image
# from io import BytesIO
# app = Flask(__name__)

# print("🚀 Loading face models...")

# # Warm up model once (important for performance)
# _ = DeepFace.represent(
#     img_path=np.zeros((100, 100, 3), dtype=np.uint8),
#     model_name="Facenet",
#     detector_backend="skip"
# )

# print("✅ Models loaded")


# # ===============================
# # Base64 → OpenCV Image
# # ===============================
# def base64_to_image(image_base64):
#     if "," in image_base64:
#         image_base64 = image_base64.split(",")[1]

#     img_bytes = base64.b64decode(image_base64)
#     img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    
#     frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
#     frame = cv2.resize(frame, (640, 480))
#     if frame is None:
#         raise ValueError("Image decoding failed")

#     return frame

# # def url_to_image(image_url):
# #     response = requests.get(image_url)
# #     img = Image.open(BytesIO(response.content))
# #     img = np.array(img)

# #     img = cv2.resize(img, (640, 480))
# #     return img

# def url_to_image(image_url):
#     image_url = urllib.parse.quote(image_url, safe=":/")

#     #response = requests.get(image_url)
#     response = requests.get(stored_image_url)
#     #img = Image.open(BytesIO(response.content))
#     img = Image.open(BytesIO(response.content)).convert("RGB") 
#     img = np.array(img)

#     img = cv2.resize(img, (640, 480))
#     return img
# # ===============================
# # Verify Face Route
# # ===============================
# @app.route("/verify-face", methods=["POST"])
# def verify_face():
#     try:
#         data = request.json
#         # stored_image = data.get("stored_image")
#         # live_image = data.get("live_image")
#         stored_image_url = data.get("stored_image")
#         live_image_base64 = data.get("live_image")
#         print("Stored image URL:", stored_image_url)
#         print("Live image received")
#         if not stored_image_url or not live_image_base64:
#             return jsonify({
#                 "success": False,
#                 "message": "Both images required"
#             })
#         print("Stored image URL:", stored_image_url)
#         print("Live image received")
#         # img1 = base64_to_image(stored_image)
#         # img2 = base64_to_image(live_image)
#         img1 = url_to_image(stored_image_url)   # from Supabase     
#         img2 = base64_to_image(live_image_base64) 
       
#         # 🔥 Face Verification
#         result = DeepFace.verify(
#     img1_path=img1,
#     img2_path=img2,
#     model_name="Facenet",
#     detector_backend="retinaface",
#     enforce_detection=True,
#     distance_metric="cosine"
# )

#         # 🔥 Custom threshold (you can tune this)
#         custom_threshold = 0.55

#         is_match = result["distance"] < custom_threshold

#         return jsonify({
#             "success": is_match,
#             "distance": float(result["distance"]),
#             "threshold": custom_threshold
#         })

#     except Exception as e:
#         print("FACE ERROR:", str(e))
#         return jsonify({
#             "success": False,
#             "message": "Face not detected"
#         })
# import base64
# import cv2
# import numpy as np
# import requests
# from PIL import Image
# from io import BytesIO
# from deepface import DeepFace

# print("🚀 Loading face models...")

# _ = DeepFace.represent(
#     img_path=np.zeros((100, 100, 3), dtype=np.uint8),
#     model_name="Facenet",
#     detector_backend="skip"
# )

# print("✅ Models loaded")


# def base64_to_image(image_base64):
#     if "," in image_base64:
#         image_base64 = image_base64.split(",")[1]

#     img_bytes = base64.b64decode(image_base64)
#     img_array = np.frombuffer(img_bytes, dtype=np.uint8)

#     frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
#     frame = cv2.resize(frame, (640, 480))

#     return frame


# def url_to_image(image_url):
#     response = requests.get(image_url)
#     img = Image.open(BytesIO(response.content))
#     img = np.array(img)

#     img = cv2.resize(img, (640, 480))
#     return img


# def verify_face_from_base64(stored_image_url, live_image_base64):
#     try:
#         img1 = url_to_image(stored_image_url)
#         img2 = base64_to_image(live_image_base64)

#         result = DeepFace.verify(
#             img1_path=img1,
#             img2_path=img2,
#             model_name="Facenet",
#             detector_backend="retinaface",
#             enforce_detection=False,
#             distance_metric="cosine"
#         )

#         threshold = 0.55
#         is_match = result["distance"] < threshold

#         return {
#             "success": is_match,
#             "distance": float(result["distance"]),
#             "threshold": threshold
#         }

#     except Exception as e:
#         return {
#             "success": False,
#             "message": "Face verification failed"
#         }

# # ===============================
# # Run Server
# # ===============================
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001)


import base64
import cv2
import numpy as np
import requests
from flask import Flask, request, jsonify
from deepface import DeepFace
from PIL import Image
from io import BytesIO
import urllib.parse

app = Flask(__name__)

print("🚀 Loading face model...")

# warmup
_ = DeepFace.represent(
    img_path=np.zeros((100, 100, 3), dtype=np.uint8),
    model_name="Facenet",
    detector_backend="skip"
)

print("✅ Model loaded")


# ============================
# Base64 → OpenCV image
# ============================
def base64_to_image(image_base64):

    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    img_bytes = base64.b64decode(image_base64)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)

    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("Live image decoding failed")

    frame = cv2.resize(frame, (640, 480))

    # ensure 3 channels
    if frame.shape[2] == 4:
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

    return frame


# ============================
# URL → OpenCV image
# ============================
def url_to_image(image_url):

    image_url = urllib.parse.quote(image_url, safe=":/")

    response = requests.get(image_url)

    img = Image.open(BytesIO(response.content))

    # convert to RGB (removes alpha channel)
    img = img.convert("RGB")

    img = np.array(img)

    img = cv2.resize(img, (640, 480))

    # ensure 3 channels
    if img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

    return img


# ============================
# Face Verification API
# ============================
@app.route("/verify-face", methods=["POST"])
def verify_face():

    try:

        data = request.json

        stored_image_url = data.get("stored_image")
        live_image_base64 = data.get("live_image")

        if not stored_image_url or not live_image_base64:
            return jsonify({
                "success": False,
                "message": "Both images required"
            })

        print("Stored image URL:", stored_image_url)
        print("Live image received")

        img1 = url_to_image(stored_image_url)
        img2 = base64_to_image(live_image_base64)

        print("Stored image shape:", img1.shape)
        print("Live image shape:", img2.shape)

        # Face verification
        result = DeepFace.verify(
            img1_path=img1,
            img2_path=img2,
            model_name="Facenet512",
            detector_backend="opencv",   # 🔥 More stable than retinaface
            enforce_detection=False,
            distance_metric="cosine"
        )

        distance = float(result["distance"])

        threshold = 0.40

        is_match = distance < threshold

        print("Distance:", distance)

        return jsonify({
            "success": is_match,
            "distance": distance,
            "threshold": threshold
        })

    except Exception as e:

        print("FACE ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": "Face not detected"
        })


# ============================
# Run server
# ============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)