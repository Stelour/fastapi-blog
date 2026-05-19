import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './PostPage.css'
import Header from '../../components/Header/Header'
import PostCardFull from '../../components/PostCard/PostCardFull'
import CommentCard from '../../components/CommentCard/CommentCard'
import {
    createComment,
    deleteComment,
    deletePost,
    getCurrentUser,
    getPost,
    getPostComments,
    reactComment,
    reactPost,
    updateComment,
} from '../../api/client'

function PostPage() {
    const { postId } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [postReaction, setPostReaction] = useState(null)
    const [commentReactions, setCommentReactions] = useState({})
    const [commentBody, setCommentBody] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isReacting, setIsReacting] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')

    useEffect(() => {
        let isMounted = true

        if (!postId) {
            Promise.resolve().then(() => {
                if (isMounted) {
                    setIsLoading(false)
                    setError('Post id is missing.')
                }
            })

            return () => {
                isMounted = false
            }
        }

        Promise.all([
                getPost(postId),
                getPostComments(postId),
                getCurrentUser().catch(() => null),
            ])
            .then(([loadedPost, loadedComments, loadedCurrentUser]) => {
                if (isMounted) {
                    setPost(loadedPost)
                    setComments(loadedComments)
                    setCurrentUser(loadedCurrentUser)
                    setPostReaction(loadedPost.my_reaction ?? getSavedReaction(loadedCurrentUser?.id, 'post', loadedPost.id))
                    setCommentReactions(getSavedCommentReactions(loadedCurrentUser?.id, loadedComments))
                    setError('')
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message)
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [postId])

    const handlePostReaction = async (value) => {
        setIsReacting(true)
        setActionError('')

        try {
            await reactPost(postId, value)
            const nextReaction = postReaction === value ? null : value
            saveReaction(currentUser?.id, 'post', postId, nextReaction)

            const updatedPost = await getPost(postId)
            setPost(updatedPost)
            setPostReaction(updatedPost.my_reaction ?? nextReaction)
        } catch (err) {
            setActionError(err.message)
        } finally {
            setIsReacting(false)
        }
    }

    const handleCommentReaction = async (commentId, value) => {
        setIsReacting(true)
        setActionError('')

        try {
            await reactComment(commentId, value)
            const currentReaction = commentReactions[commentId] ?? null
            const nextReaction = currentReaction === value ? null : value
            saveReaction(currentUser?.id, 'comment', commentId, nextReaction)
            setCommentReactions((currentReactions) => ({
                ...currentReactions,
                [commentId]: nextReaction,
            }))

            const updatedComments = await getPostComments(postId)
            setComments(updatedComments)
            setCommentReactions(getSavedCommentReactions(currentUser?.id, updatedComments))
        } catch (err) {
            setActionError(err.message)
        } finally {
            setIsReacting(false)
        }
    }

    const handleCreateComment = async (event) => {
        event.preventDefault()

        const body = commentBody.trim()
        if (!body) {
            setActionError('Comment cannot be empty.')
            return
        }

        setIsSubmitting(true)
        setActionError('')

        try {
            await createComment(postId, body)
            const updatedComments = await getPostComments(postId)
            setComments(updatedComments)
            setCommentBody('')
        } catch (err) {
            setActionError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeletePost = async () => {
        setActionError('')

        try {
            await deletePost(postId)
            navigate('/')
        } catch (err) {
            setActionError(err.message)
        }
    }

    const handleUpdateComment = async (commentId, nextBody) => {
        setActionError('')

        try {
            await updateComment(commentId, nextBody.trim())
            const updatedComments = await getPostComments(postId)
            setComments(updatedComments)
        } catch (err) {
            setActionError(err.message)
        }
    }

    const handleDeleteComment = async (commentId) => {
        setActionError('')

        try {
            await deleteComment(commentId)
            const updatedComments = await getPostComments(postId)
            setComments(updatedComments)
        } catch (err) {
            setActionError(err.message)
        }
    }

    return (
        <div className="post-page">

            <div className="background-glow"></div>

            <Header />

            <main className="posts-container">

                {isLoading && (
                    <p className="feed-state">
                        Loading post...
                    </p>
                )}

                {!isLoading && error && (
                    <p className="feed-state feed-state-error">
                        {error}
                    </p>
                )}

                {!isLoading && !error && post && (
                    <PostCardFull
                        post={post}
                        commentsCount={comments.length}
                        onReact={handlePostReaction}
                        isReacting={isReacting}
                        activeReaction={postReaction}
                        canManage={currentUser?.id === post.author_id}
                        onEdit={() => navigate(`/post/${post.id}/edit`)}
                        onDelete={handleDeletePost}
                    />
                )}

            </main>

            {!isLoading && !error && post && (
                <>
                    <form className="comment-form" onSubmit={handleCreateComment}>

                        <input
                            placeholder="Create comment..."
                            className="comment-input"
                            value={commentBody}
                            onChange={(event) => setCommentBody(event.target.value)}
                        />

                        <button type="submit" className="comment-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Create'}
                        </button>

                    </form>

                    {actionError && (
                        <p className="post-action-error">
                            {actionError}
                        </p>
                    )}

                    <div className="comments-container">

                        {comments.length === 0 && (
                            <p className="comments-empty">
                                No comments yet.
                            </p>
                        )}

                        {comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                onReact={handleCommentReaction}
                                isReacting={isReacting}
                                activeReaction={commentReactions[comment.id] ?? null}
                                canManage={currentUser?.id === comment.author_id}
                                onUpdate={handleUpdateComment}
                                onDelete={handleDeleteComment}
                            />
                        ))}

                    </div>
                </>
            )}

        </div>
    )
}

function getReactionStorageKey(userId, type, id) {
    return userId ? `reaction:${userId}:${type}:${id}` : null
}

function getSavedReaction(userId, type, id) {
    const key = getReactionStorageKey(userId, type, id)
    if (!key) {
        return null
    }

    const savedValue = localStorage.getItem(key)
    return savedValue ? Number(savedValue) : null
}

function saveReaction(userId, type, id, value) {
    const key = getReactionStorageKey(userId, type, id)
    if (!key) {
        return
    }

    if (value === null) {
        localStorage.removeItem(key)
    } else {
        localStorage.setItem(key, String(value))
    }
}

function getSavedCommentReactions(userId, comments) {
    return comments.reduce((reactions, comment) => ({
        ...reactions,
        [comment.id]: comment.my_reaction ?? getSavedReaction(userId, 'comment', comment.id),
    }), {})
}

export default PostPage
