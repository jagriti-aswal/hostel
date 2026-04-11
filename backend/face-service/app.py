from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from face_auth import verify_face_from_base64

app = FastAPI(title="Face Authentication Service")

# ============================
# CORS (allow frontend/backend)
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # you can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# Request Model
# ============================
class FaceLoginRequest(BaseModel):
    stored_image: str   # URL
    live_image: str     # base64

# ============================
# Health Check (IMPORTANT)
# ============================
@app.get("/")
def home():
    return {"message": "Face Service Running"}

# ============================
# Face Verification Route
# ============================
@app.post("/face/login")
def face_login(data: FaceLoginRequest):
    return verify_face_from_base64(
        data.stored_image,
        data.live_image
    )