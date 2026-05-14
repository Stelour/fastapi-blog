import './PostCard.css'
import userIcon from '../../assets/icons/user.svg'
import likeIcon from '../../assets/icons/thumb-up.svg'
import dislikeIcon from '../../assets/icons/thumb-down.svg'
import commentIcon from '../../assets/icons/comment.svg'

function PostCard() {

    return (
        <article className="post-card">

            <div className="post-top">

                <div className="post-top-left">

                    <div className="user-info">

                        <img src={userIcon} alt=""/>

                        <span className="username">
                            Username
                        </span>

                        <span className="time">
                            5 hr ago
                        </span>

                    </div>

                    <h2 className="post-title">
                        Title title title title...
                    </h2>

                </div>

                <div className="tags">

                    <span className="tag">Shopping</span>
                    <span className="tag">Shopping</span>
                    <span className="tag">Shopping</span>
                    <span className="tag">Shopping</span>

                </div>

            </div>

            <div className="post-bottom">

                <p className="post-body">
                    Body body body body body body body body body body
                    body body body body body body body body body body
                    body body body body body body body body body...
                </p>

            </div>

            <div className="stats">

                <div className="stat">

                    <img src={likeIcon} alt=""/>

                    67

                </div>

                <div className="stat">

                    <img src={dislikeIcon} alt=""/>

                    67

                </div>

                <div className="stat">

                    <img src={commentIcon} alt=""/>

                    67

                </div>

            </div>

        </article>
    )
}

export default PostCard