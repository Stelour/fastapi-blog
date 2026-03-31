from fastapi import APIRouter, Depends, HTTPException, File, Form, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import re

from backend.auth.routes import get_current_user
from backend.db import get_db
from backend.models import User, Profile
from backend.schemas import ProfileInfoResponse, ProfileSearchResponse
from backend.profile.avatar_change import *


router = APIRouter(tags=["profiles"])


def validate_public_id(public_id: str):
    public_id = public_id.strip()

    if not public_id:
        raise HTTPException(status_code=400, detail="Public ID cannot be empty")

    if len(public_id) > 64:
        raise HTTPException(status_code=400, detail="Public ID is too long")

    if not re.fullmatch(r"[A-Za-z0-9_.]+", public_id):
        raise HTTPException(
            status_code=400,
            detail="Public ID can contain only letters, numbers, underscore and dot",
        )

    return public_id


@router.get("/{public_id}", response_model=ProfileInfoResponse)
async def get_profile(public_id: str, db: AsyncSession = Depends(get_db)):
    query = (
        select(Profile)
        .options(selectinload(Profile.user))
        .where(Profile.public_id == public_id)
    )
    result = await db.execute(query)
    profile = result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    return ProfileInfoResponse(
        id=profile.id,
        username=profile.user.username,
        avatar_path=profile.avatar_path,
        bio=profile.bio,
        last_seen=profile.last_seen,
        public_id=profile.public_id,
    )

@router.patch("/{public_id}/edit", response_model=ProfileInfoResponse)
async def edit_profile(
    public_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    username: str | None = Form(None),
    bio: str | None = Form(None),
    new_public_id: str | None = Form(None),
    avatar: UploadFile | None = File(None),
):
    query = (
        select(Profile)
        .options(selectinload(Profile.user))
        .where(Profile.public_id == public_id)
    )
    result = await db.execute(query)
    profile = result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    if profile.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can edit only your own profile",
        )

    if username and username != profile.user.username:
        existing_user = await db.execute(
            select(User).where(User.username == username)
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Username already taken")
        profile.user.username = username

    target_public_id = profile.public_id

    if new_public_id is not None:
        new_public_id = validate_public_id(new_public_id)

        if new_public_id != profile.public_id:
            existing_profile = await db.execute(
                select(Profile).where(Profile.public_id == new_public_id)
            )
            if existing_profile.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Public ID already taken")

            if profile.public_id:
                await rename_avatar_directory(profile.public_id, new_public_id)

            profile.public_id = new_public_id
            target_public_id = new_public_id

    profile.bio = bio

    if avatar is not None:
        avatar_path, filename = await save_avatar(avatar, target_public_id)
        await clear_old_avatars(target_public_id, filename)
        profile.avatar_path = avatar_path

    await db.commit()
    await db.refresh(profile)
    await db.refresh(profile, attribute_names=["user"])

    return ProfileInfoResponse(
        id=profile.id,
        username=profile.user.username,
        avatar_path=profile.avatar_path,
        bio=profile.bio,
        last_seen=profile.last_seen,
        public_id=profile.public_id,
    )

@router.get("/search", response_model=list[ProfileSearchResponse])
async def search_profiles(q: str, db: AsyncSession = Depends(get_db)):
    search = q.strip()
    if not search:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    query = (
        select(Profile)
        .join(Profile.user)
        .options(selectinload(Profile.user))
        .where(
            or_(
                User.username.ilike(f"%{search}%"),
                Profile.public_id.ilike(f"%{search}%"),
            )
        )
        .order_by(User.username.asc())
    )

    result = await db.execute(query)
    profiles = result.scalars().all()

    return [
        ProfileSearchResponse(
            username=profile.user.username,
            public_id=profile.public_id,
            avatar_path=profile.avatar_path,
            bio=profile.bio,
        )
        for profile in profiles
    ]
