import './PostCardFull.css'
import userIcon from '../../assets/icons/user.svg'
import likeIcon from '../../assets/icons/thumb-up.svg'
import dislikeIcon from '../../assets/icons/thumb-down.svg'

function PostCardFull() {

    return (
        <article className="post-card">

            <div className="post-top">

                <div className="post-top-left">

                    <div className="post-top-group">

                        <div className="user-info">

                            <img src={userIcon} alt=""/>

                            <span className="username">
                            Username
                        </span>

                            <span className="time">
                            5 hr ago
                        </span>

                        </div>

                        <button className="post-top-button">...</button>

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

                <button className="stat-button like">

                    <img src={likeIcon} alt=""/>

                    67

                </button>

                <button className="stat-button dislike">

                    <img src={dislikeIcon} alt=""/>

                    67

                </button>

            </div>

        </article>
    )
}

export default PostCardFull