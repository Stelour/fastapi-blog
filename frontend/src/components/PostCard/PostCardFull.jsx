import { Link } from 'react-router-dom'
import './PostCardFull.css'
import userIcon from '../../assets/icons/user.svg'
import likeIcon from '../../assets/icons/thumb-up.svg'
import dislikeIcon from '../../assets/icons/thumb-down.svg'
import { getFileUrl } from '../../api/client'
import { formatDateTime } from '../../utils/format'

function PostCardFull({ post, commentsCount, onReact, isReacting }) {
    const authorPublicId = post.author_public_id ?? `id_${post.author_id}`
    const profilePath = `/profile/${authorPublicId}`
    const avatarSrc = post.author_avatar_path ? getFileUrl(post.author_avatar_path) : userIcon

    return (
        <article className="post-card post-card-full">

            <div className="post-top">

                <div className="post-top-left">

                    <div className="post-top-group">

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
                                {post.author_username}
                            </Link>

                            <span className="time">
                                {formatDateTime(post.timestamp)}
                            </span>

                        </div>

                        <button className="post-top-button">...</button>

                    </div>

                    <h2 className="post-title">
                        {post.title}
                    </h2>

                </div>

                <div className="tags">

                    {post.categories.length > 0 ? (
                        post.categories.map((category, index) => (
                            <span className="tag" key={`${category}-${index}`}>{category}</span>
                        ))
                    ) : (
                        <span className="tag">general</span>
                    )}

                </div>

            </div>

            <div className="post-bottom">

                <p className="post-body">
                    {post.body}
                </p>

            </div>

            <div className="stats">

                <button
                    className="stat-button like"
                    type="button"
                    disabled={isReacting}
                    onClick={() => onReact(1)}
                >

                    <img src={likeIcon} alt=""/>

                    {post.likes_count}

                </button>

                <button
                    className="stat-button dislike"
                    type="button"
                    disabled={isReacting}
                    onClick={() => onReact(-1)}
                >

                    <img src={dislikeIcon} alt=""/>

                    {post.dislikes_count}

                </button>

                <div className="stat-count">
                    {commentsCount} comments
                </div>

            </div>

        </article>
    )
}

export default PostCardFull
