from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, case, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.auth.routes import get_current_user
from backend.db import get_db
from backend.models import User, Profile, Post, PostReaction, Comment, CommentReaction
from backend.schemas import (
    DeletePostResponse,
    PostCreateRequest,
    PostResponse,
    PostUpdateRequest,
    ReactionRequest,
    ReactionResponse,
    CommentCreateRequest,
    CommentUpdateRequest,
    CommentResponse,
    CommentResponsePP,
    PostResponsePP
)


router = APIRouter(tags=["posts"])


def f_reaction_counts():
    return (
        select(
            PostReaction.post_id.label("post_id"),
            func.count(case((PostReaction.value == 1, 1))).label("likes_count"),
            func.count(case((PostReaction.value == -1, 1))).label("dislikes_count"),
        )
        .group_by(PostReaction.post_id)
        .subquery()
    )

def resp_return(post: Post, likes_count: int | None, dislikes_count: int | None) -> PostResponse:
    return PostResponse(
        id=post.id,
        title=post.title,
        body=post.body,
        timestamp=post.timestamp,
        categories=post.categories,
        author_id=post.author.id,
        author_username=post.author.username,
        likes_count=likes_count or 0,
        dislikes_count=dislikes_count or 0,
    )


@router.get("/user/{public_id}", response_model=list[PostResponse])
async def get_posts_for_user(public_id: str, db: AsyncSession = Depends(get_db)):
    reaction_counts = f_reaction_counts()

    query = (
        select(Post, reaction_counts.c.likes_count, reaction_counts.c.dislikes_count)
        .join(Post.author)
        .join(User.profile)
        .options(selectinload(Post.author))
        .outerjoin(reaction_counts, reaction_counts.c.post_id == Post.id)
        .where(Profile.public_id == public_id)
        .order_by(Post.timestamp.desc())
    )

    result = await db.execute(query)
    rows = result.all()

    return [
        resp_return(post, likes_count, dislikes_count)
        for post, likes_count, dislikes_count in rows
    ]

@router.get("/", response_model=list[PostResponse])
async def get_posts(db: AsyncSession = Depends(get_db)):
    reaction_counts = f_reaction_counts()

    query = (
        select(Post, reaction_counts.c.likes_count, reaction_counts.c.dislikes_count)
        .options(selectinload(Post.author))
        .outerjoin(reaction_counts, reaction_counts.c.post_id == Post.id)
        .order_by(Post.timestamp.desc())
    )

    result = await db.execute(query)
    rows = result.all()

    return [
        resp_return(post, likes_count, dislikes_count)
        for post, likes_count, dislikes_count in rows
    ]

@router.get("/id/{post_id}", response_model=PostResponse)
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)):
    reaction_counts = f_reaction_counts()

    query = (
        select(Post, reaction_counts.c.likes_count, reaction_counts.c.dislikes_count)
        .options(selectinload(Post.author))
        .outerjoin(reaction_counts, reaction_counts.c.post_id == Post.id)
        .where(Post.id == post_id)
    )

    result = await db.execute(query)
    row = result.one_or_none()

    if row is None:
        raise HTTPException(status_code=404, detail="Post not found")

    post, likes_count, dislikes_count = row
    return resp_return(post, likes_count, dislikes_count)

@router.post("/", response_model=PostResponsePP, status_code=201)
async def create_post(
    data: PostCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    title = data.title.strip()
    body = data.body.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    if not body:
        raise HTTPException(status_code=400, detail="Body cannot be empty")

    categories = [item.strip().lower() for item in data.categories if item.strip()]

    new_post = Post(
        title=title,
        body=body,
        categories=categories,
        user_id=current_user.id
    )

    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)

    return PostResponsePP(
        id=new_post.id,
        title=new_post.title,
        body=new_post.body,
        timestamp=new_post.timestamp,
        categories=new_post.categories,
        author_id=current_user.id,
        author_username=current_user.username
    )

@router.delete("/{post_id}", response_model=DeletePostResponse)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can delete only your own posts",
        )

    await db.delete(post)
    await db.commit()

    return {"detail": "Post deleted"}

@router.patch("/{post_id}", response_model=PostResponsePP)
async def update_post(
    post_id: int,
    data: PostUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Post).options(selectinload(Post.author)).where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can edit only your own posts",
        )

    if data.title is not None:
        title = data.title.strip()
        if not title:
            raise HTTPException(status_code=400, detail="Title cannot be empty")
        post.title = title

    if data.body is not None:
        body = data.body.strip()
        if not body:
            raise HTTPException(status_code=400, detail="Body cannot be empty")
        post.body = body

    if data.categories is not None:
        post.categories = [item.strip().lower() for item in data.categories if item.strip()]

    await db.commit()
    await db.refresh(post)

    return PostResponsePP(
        id=post.id,
        title=post.title,
        body=post.body,
        timestamp=post.timestamp,
        categories=post.categories,
        author_id=post.author.id,
        author_username=post.author.username
    )


@router.post("/comments/{post_id}", response_model=CommentResponsePP, status_code=201)
async def create_comment(
    post_id: int,
    data: CommentCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    body = data.body.strip()
    if not body:
        raise HTTPException(status_code=400, detail="Body cannot be empty")

    new_comment = Comment(
        body=body,
        post_id=post_id,
        user_id=current_user.id
    )

    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)

    return CommentResponsePP(
        id=new_comment.id,
        body=new_comment.body,
        timestamp=new_comment.timestamp,
        post_id=new_comment.post_id,
        author_id=current_user.id,
        author_username=current_user.username,
    )

@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
async def get_post_comments(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    reaction_counts = select(
            CommentReaction.comment_id.label("comment_id"),
            func.count(case((CommentReaction.value == 1, 1))).label("likes_count"),
            func.count(case((CommentReaction.value == -1, 1))).label("dislikes_count"),
        ).group_by(CommentReaction.comment_id).subquery()

    result = await db.execute(
        select(Comment, reaction_counts.c.likes_count, reaction_counts.c.dislikes_count)
        .options(selectinload(Comment.author))
        .outerjoin(reaction_counts, reaction_counts.c.comment_id == Comment.id)
        .where(Comment.post_id == post_id)
        .order_by(Comment.timestamp.asc())
    )
    comments = result.all()

    return [
        CommentResponse(
            id=comment.id,
            body=comment.body,
            timestamp=comment.timestamp,
            post_id=comment.post_id,
            author_id=comment.author.id,
            author_username=comment.author.username,
            likes_count=likes_count or 0,
            dislikes_count=dislikes_count or 0
        )
        for comment, likes_count, dislikes_count in comments
    ]

@router.delete("/comments/{comment_id}", response_model=ReactionResponse)
async def delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Comment).where(Comment.id == comment_id))
    comment = result.scalar_one_or_none()

    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can delete only your own comments",
        )

    await db.delete(comment)
    await db.commit()

    return {"detail": "Comment deleted"}

@router.patch("/comments/{comment_id}", response_model=CommentResponsePP)
async def update_comment(
    comment_id: int,
    data: CommentUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Comment).where(Comment.id == comment_id)
    result = await db.execute(query)
    comment = result.scalar_one_or_none()

    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can edit only your own comments",
        )

    if data.body is not None:
        body = data.body.strip()
        if not body:
            raise HTTPException(status_code=400, detail="Comment body cannot be empty")
        comment.body = body

    await db.commit()
    await db.refresh(comment)

    return CommentResponsePP(
        id=comment.id,
        body=comment.body,
        timestamp=comment.timestamp,
        post_id=comment.post_id,
        author_id=current_user.id,
        author_username=current_user.username
    )


@router.post("/reaction/{post_id}", response_model=ReactionResponse)
async def react_post(
    post_id: int,
    data: ReactionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    reaction_result = await db.execute(
        select(PostReaction).where(
            PostReaction.post_id == post_id,
            PostReaction.user_id == current_user.id,
        )
    )
    reaction = reaction_result.scalar_one_or_none()
    if reaction is None:
        reaction = PostReaction(
            post_id=post_id,
            user_id=current_user.id,
            value=data.value,
        )
        db.add(reaction)
    elif reaction.value == data.value:
        await db.delete(reaction)
    else:
        reaction.value = data.value

    await db.commit()
    return {"detail": "Reaction updated"}


@router.post("/comments/reaction/{comment_id}", response_model=ReactionResponse)
async def react_comment(
    comment_id: int,
    data: ReactionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Comment).where(Comment.id == comment_id)
    result = await db.execute(query)
    comment = result.scalar_one_or_none()

    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    reaction_result = await db.execute(
        select(CommentReaction).where(
            CommentReaction.comment_id == comment_id,
            CommentReaction.user_id == current_user.id,
        )
    )
    reaction = reaction_result.scalar_one_or_none()
    if reaction is None:
        reaction = CommentReaction(
            comment_id=comment_id,
            user_id=current_user.id,
            value=data.value,
        )
        db.add(reaction)
    elif reaction.value == data.value:
        await db.delete(reaction)
    else:
        reaction.value = data.value

    await db.commit()
    return {"detail": "Reaction updated"}
