import './CommentCard.css'
import userIcon from '../../assets/icons/user.svg'
import likeIcon from '../../assets/icons/thumb-up.svg'
import dislikeIcon from '../../assets/icons/thumb-down.svg'

function CommentCard() {

    return (
        <article className="comment-card">

            <div className="comment-top">

                <div className="comment-top-group">

                    <div className="user-info">

                        <img src={userIcon} alt=""/>

                        <span className="username">
                            Username
                        </span>

                        <span className="time">
                            5 hr ago
                        </span>

                    </div>

                    <button className="comment-top-button">...</button>

                </div>

            </div>

            <p className="comment-body">
                comment text dddddddddddddasdasdadads
                comment
                Comment
                comment text
            </p>

            <div className="comment-stats">

                <button className="comment-stat-button like">

                    <img src={likeIcon} alt=""/>

                    67

                </button>

                <button className="comment-stat-button dislike">

                    <img src={dislikeIcon} alt=""/>

                    67

                </button>

            </div>

        </article>
    )
}

export default CommentCard