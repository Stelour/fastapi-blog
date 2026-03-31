from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str

class UserSchema(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=32)

class RegisterResponse(BaseModel):
    user_id: int
    username: str
    email: EmailStr


class ProfileInfoResponse(BaseModel):
    id: int
    username: str
    avatar_path: str | None = None
    bio: str | None = None
    last_seen: datetime
    public_id: str | None = None

class ProfileSearchResponse(BaseModel):
    username: str
    public_id: str | None
    avatar_path: str | None
    bio: str | None


class PostCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1)
    categories: list[str] = Field(default_factory=list)

class PostResponse(BaseModel):
    id: int
    title: str
    body: str
    timestamp: datetime
    categories: list[str]
    author_id: int
    author_username: str
    likes_count: int
    dislikes_count: int

class DeletePostResponse(BaseModel):
    detail: str

class PostUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    body: str | None = None
    categories: list[str] | None = None

class PostResponsePP(BaseModel):
    id: int
    title: str
    body: str
    timestamp: datetime
    categories: list[str]
    author_id: int
    author_username: str


class CommentCreateRequest(BaseModel):
    body: str

class CommentUpdateRequest(BaseModel):
    body: str | None = None

class CommentResponsePP(BaseModel):
    id: int
    body: str
    timestamp: datetime
    post_id: int
    author_id: int
    author_username: str

class CommentResponse(BaseModel):
    id: int
    body: str
    timestamp: datetime
    post_id: int
    author_id: int
    author_username: str
    likes_count: int
    dislikes_count: int


class ReactionRequest(BaseModel):
    value: int

    @field_validator("value")
    @classmethod
    def validate_value(cls, value: int) -> int:
        if value not in (1, -1):
            raise ValueError("Value must be 1 or -1")
        return value

class ReactionResponse(BaseModel):
    detail: str
