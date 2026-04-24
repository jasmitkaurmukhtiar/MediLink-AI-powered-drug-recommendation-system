from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.predict import router as predict_router

app = FastAPI(
    title="RAREMed Drug Recommendation API",
    description="Medication recommendation using RAREMed",
    version="1.0"
)

# Allow React frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(predict_router)


@app.get("/")
def home():
    return {"message": "RAREMed API Running"}