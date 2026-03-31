import os
from pathlib import Path

from fastapi import UploadFile
from PIL import Image, ImageOps


STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
AVATARS_DIR = STATIC_DIR / "avatars"


async def save_avatar(uploaded_file: UploadFile, public_id: str):
    original_name = uploaded_file.filename or "avatar.png"
    _, ext = os.path.splitext(original_name)
    ext = ext.lower() if ext else ".png"

    filename = f"avatar{ext}"
    avatar_folder = AVATARS_DIR / public_id
    avatar_folder.mkdir(parents=True, exist_ok=True)

    file_path = avatar_folder / filename

    content = await uploaded_file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    with Image.open(file_path) as img:
        img = ImageOps.exif_transpose(img)
        size = min(img.width, img.height)
        img_cropped = ImageOps.fit(img, (size, size), centering=(0.5, 0.5))
        img_resized = img_cropped.resize((256, 256), Image.Resampling.LANCZOS)
        img_resized.save(file_path)

    relative_path = f"static/avatars/{public_id}/{filename}"
    return relative_path, filename


async def rename_avatar_directory(old_public_id: str, new_public_id: str):
    old_path = AVATARS_DIR / old_public_id
    new_path = AVATARS_DIR / new_public_id

    if old_path.exists() and not new_path.exists():
        old_path.rename(new_path)


async def clear_old_avatars(public_id: str, current_filename: str):
    folder = AVATARS_DIR / public_id
    if folder.exists():
        for filename in os.listdir(folder):
            if filename != current_filename:
                file_path = folder / filename
                if file_path.is_file():
                    file_path.unlink()