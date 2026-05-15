import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './PostPage.css'
import Header from '../../components/Header/Header'
import PostCardFull from '../../components/PostCard/PostCardFull'
import CommentCard from '../../components/CommentCard/CommentCard'
import {
    createComment,
    getPost,
    getPostComments,
    reactComment,
    reactPost,
} from '../../api/client'

function PostPage() {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
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
            ])
            .then(([loadedPost, loadedComments]) => {
                if (isMounted) {
                    setPost(loadedPost)
                    setComments(loadedComments)
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
            const updatedPost = await getPost(postId)
            setPost(updatedPost)
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
            const updatedComments = await getPostComments(postId)
            setComments(updatedComments)
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
                            />
                        ))}

                    </div>
                </>
            )}

        </div>
    )
}

export default PostPage
