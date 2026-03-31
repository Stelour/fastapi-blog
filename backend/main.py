from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.posts.routes import router as posts_router
from backend.auth.routes import router as auth_router
from backend.profile.routes import router as profile_router

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

    blog_app.include_router(auth_router, prefix="/auth")
    blog_app.include_router(profile_router, prefix="/profiles")
    blog_app.include_router(posts_router, prefix="/posts")

    return blog_app

app = create_app()
