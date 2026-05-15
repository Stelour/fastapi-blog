import { Link, useNavigate } from 'react-router-dom'
import './PostCard.css'
import userIcon from '../../assets/icons/user.svg'
import likeIcon from '../../assets/icons/thumb-up.svg'
import dislikeIcon from '../../assets/icons/thumb-down.svg'
import commentIcon from '../../assets/icons/comment.svg'
import { getFileUrl } from '../../api/client'
import { formatDateTime, truncateText } from '../../utils/format'

function PostCard({ post }) {
    const navigate = useNavigate()
    const authorPublicId = post.author_public_id ?? `id_${post.author_id}`
    const profilePath = `/profile/${authorPublicId}`
    const avatarSrc = post.author_avatar_path ? getFileUrl(post.author_avatar_path) : userIcon

    const openPost = () => {
        navigate(`/post/${post.id}`)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPost()
        }
    }

    return (
        <article
            className="post-card post-card-clickable"
            onClick={openPost}
            onKeyDown={handleKeyDown}
            role="link"
            tabIndex={0}
        >

            <div className="post-top">

                <div className="post-top-left">

                    <div className="user-info">

                        <Link className="user-link" to={profilePath} onClick={(event) => event.stopPropagation()}>
                            <img
                                src={avatarSrc}
                                alt=""
                                onError={(event) => {
                                    event.currentTarget.onerror = null
                                    event.currentTarget.src = userIcon
                                }}
                            />
                        </Link>

                        <Link className="username user-link" to={profilePath} onClick={(event) => event.stopPropagation()}>
                            {post.author_username}
                        </Link>

                        <span className="time">
                            {formatDateTime(post.timestamp)}
                        </span>

                    </div>

                    <h2 className="post-title">
                        {post.title}
                    </h2>

                </div>

                <div className="tags">

                    {post.categories.length > 0 ? (
                        post.categories.slice(0, 4).map((category, index) => (
                            <span className="tag" key={`${category}-${index}`}>{category}</span>
                        ))
                    ) : (
                        <span className="tag">general</span>
                    )}

                </div>

            </div>

            <div className="post-bottom">

                <p className="post-body">
                    {truncateText(post.body, 220)}
                </p>

            </div>

            <div className="stats">

                <div className="stat">

                    <img src={likeIcon} alt=""/>

                    {post.likes_count}

                </div>

                <div className="stat">

                    <img src={dislikeIcon} alt=""/>

                    {post.dislikes_count}

                </div>

                <div className="stat">

                    <img src={commentIcon} alt=""/>

                    {post.comments_count}

                </div>

            </div>

        </article>
    )
}

export default PostCard
