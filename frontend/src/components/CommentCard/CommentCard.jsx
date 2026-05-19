import { Link } from 'react-router-dom'
import { useState } from 'react'
import './CommentCard.css'
import userIcon from '../../assets/icons/user.svg'
import likeIcon from '../../assets/icons/thumb-up.svg'
import dislikeIcon from '../../assets/icons/thumb-down.svg'
import { getFileUrl } from '../../api/client'
import { formatDateTime } from '../../utils/format'

function CommentCard({
    comment,
    onReact,
    isReacting,
    activeReaction,
    canManage,
    onUpdate,
    onDelete,
}) {
    const authorPublicId = comment.author_public_id ?? `id_${comment.author_id}`
    const profilePath = `/profile/${authorPublicId}`
    const avatarSrc = comment.author_avatar_path ? getFileUrl(comment.author_avatar_path) : userIcon
    const [isEditing, setIsEditing] = useState(false)
    const [body, setBody] = useState(comment.body)

    const handleSubmit = (event) => {
        event.preventDefault()
        onUpdate(comment.id, body)
        setIsEditing(false)
    }

    return (
        <article className="comment-card">

            <div className="comment-top">

                <div className="comment-top-group">

                    <div className="user-info">

                        <Link className="user-link" to={profilePath}>
                            <img
                                src={avatarSrc}
                                alt=""
                                onError={(event) => {
                                    event.currentTarget.onerror = null
                                    event.currentTarget.src = userIcon
                                }}
                            />
                        </Link>

                        <Link className="username user-link" to={profilePath}>
                            {comment.author_username}
                        </Link>

                        <span className="time">
                            {formatDateTime(comment.timestamp)}
                        </span>

                    </div>

                    {canManage && (
                        <div className="owner-actions">
                            <button className="comment-top-button" type="button">...</button>
                            <div className="owner-menu">
                                <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
                                <button type="button" onClick={() => onDelete(comment.id)}>Delete</button>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            {isEditing ? (
                <form className="comment-edit-form" onSubmit={handleSubmit}>
                    <textarea
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                        required
                    />

                    <div className="comment-edit-actions">
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            ) : (
                <p className="comment-body">
                    {comment.body}
                </p>
            )}

            <div className="comment-stats">

                <button
                    className={`comment-stat-button like ${activeReaction === 1 ? 'active-like' : ''}`}
                    type="button"
                    disabled={isReacting}
                    onClick={() => onReact(comment.id, 1)}
                >

                    <img src={likeIcon} alt=""/>

                    {comment.likes_count}

                </button>

                <button
                    className={`comment-stat-button dislike ${activeReaction === -1 ? 'active-dislike' : ''}`}
                    type="button"
                    disabled={isReacting}
                    onClick={() => onReact(comment.id, -1)}
                >

                    <img src={dislikeIcon} alt=""/>

                    {comment.dislikes_count}

                </button>

            </div>

        </article>
    )
}

export default CommentCard
