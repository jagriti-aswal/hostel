# from fastapi import FastAPI
# from pydantic import BaseModel
# from face_auth import (
#     save_signup_image_from_base64,
#     verify_face_from_base64
# )

# app = FastAPI(title="Face Authentication Service")

# # ---------- MODELS ----------

# class FaceSignupRequest(BaseModel):
#     username: str
#     image: str
#     image_index: int

# class FaceLoginRequest(BaseModel):
#     username: str
#     image: str

# # ---------- ROUTES ----------

# @app.post("/face/signup")
# def face_signup(data: FaceSignupRequest):
#     return save_signup_image_from_base64(
#         data.username,
#         data.image,
#         data.image_index
#     )

# @app.post("/face/login")
# def face_login(data: FaceLoginRequest):
#     return verify_face_from_base64(
#         data.username,
#         data.image
#     )


# from fastapi import FastAPI
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from face_auth import verify_face_from_base64

# app = FastAPI()

# # ✅ Allow frontend access
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # later restrict to localhost:3000
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class FaceLoginRequest(BaseModel):
#     username: str
#     image: str


# @app.post("/face/login")
# def face_login(data: FaceLoginRequest):
#     return verify_face_from_base64(
#         data.username,
#         data.image
#     )
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from face_auth import verify_face_from_base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FaceLoginRequest(BaseModel):
    # username: str
    # image: str
    stored_image: str
    live_image: str


# @app.post("/face/login")
# def face_login(data: FaceLoginRequest):
#     return verify_face_from_base64(data.username, data.image)

@app.post("/face/login")
def face_login(data: FaceLoginRequest):
    return verify_face_from_base64(
        data.stored_image,
        data.live_image
    )