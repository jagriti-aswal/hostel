from fastapi import FastAPI
from pydantic import BaseModel
from face_auth import verify_face_from_base64

app = FastAPI()

class FaceLoginRequest(BaseModel):
    username: str
    image: str

@app.post("/face/login")
def face_login(data: FaceLoginRequest):
    return verify_face_from_base64(
        data.username,
        data.image
    )
