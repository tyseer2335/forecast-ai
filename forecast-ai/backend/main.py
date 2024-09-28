from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Welcome to the API"}

# pip install "uvicorn[standard]"
# uvicorn main:app