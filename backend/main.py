from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.base.routes import router as base_router
from backend.auth.routes import router as auth_router

def create_app():
    blog_app = FastAPI(title="fastapi-blog")

    blog_app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    blog_app.include_router(base_router)
    blog_app.include_router(auth_router, prefix="/auth")

    return blog_app

app = create_app()
