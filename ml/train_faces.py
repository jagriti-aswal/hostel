import face_recognition
import os
import pickle

DATASET_DIR = "ml/dataset"
ENCODINGS_FILE = "ml/face_encodings.pkl"

known_encodings = []
known_names = []

for person_name in os.listdir(DATASET_DIR):
    person_path = os.path.join(DATASET_DIR, person_name)

    if not os.path.isdir(person_path):
        continue

    for img_name in os.listdir(person_path):
        img_path = os.path.join(person_path, img_name)

        image = face_recognition.load_image_file(img_path)
        encodings = face_recognition.face_encodings(image)

        if len(encodings) > 0:
            known_encodings.append(encodings[0])
            known_names.append(person_name)

print("Faces trained:", len(known_names))

data = {
    "encodings": known_encodings,
    "names": known_names
}

with open(ENCODINGS_FILE, "wb") as f:
    pickle.dump(data, f)

print("Saved encodings to", ENCODINGS_FILE)
