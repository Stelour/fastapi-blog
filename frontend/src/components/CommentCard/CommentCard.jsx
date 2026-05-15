import { Link } from 'react-router-dom'
import './CommentCard.css'
import userIcon from '../../assets/icons/user.svg'
import likeIcon from '../../assets/icons/thumb-up.svg'
import dislikeIcon from '../../assets/icons/thumb-down.svg'
import { getFileUrl } from '../../api/client'
import { formatDateTime } from '../../utils/format'

function CommentCard({ comment, onReact, isReacting }) {
    const authorPublicId = comment.author_public_id ?? `id_${comment.author_id}`
    const profilePath = `/profile/${authorPublicId}`
    const avatarSrc = comment.author_avatar_path ? getFileUrl(comment.author_avatar_path) : userIcon

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

                    <button className="comment-top-button">...</button>

                </div>

            </div>

            <p className="comment-body">
                {comment.body}
            </p>

            <div className="comment-stats">

                <button
                    className="comment-stat-button like"
                    type="button"
                    disabled={isReacting}
                    onClick={() => onReact(comment.id, 1)}
                >

                    <img src={likeIcon} alt=""/>

                    {comment.likes_count}

                </button>

                <button
                    className="comment-stat-button dislike"
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
