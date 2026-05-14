import './PostPage.css'
import Header from '../../components/Header/Header'
import PostCardFull from '../../components/PostCard/PostCardFull'
import CommentCard from '../../components/CommentCard/CommentCard'

function PostPage() {

    return (
        <div className="post-page">

            <div className="background-glow"></div>

            <Header />

            <main className="posts-container">

                <PostCardFull />

            </main>

            <form className="comment-form">

                <input placeholder="Create comment..." className="comment-input"/>

                <button type="submit" className="comment-submit-btn">
                    Create
                </button>

            </form>

            <div className="comments-container">

                <CommentCard />
                <CommentCard />
                <CommentCard />

            </div>

        </div>
    )
}

export default PostPage