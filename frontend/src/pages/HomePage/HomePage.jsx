import Header from '../../components/Header/Header'
import PostCard from '../../components/PostCard/PostCard'

function HomePage() {

    return (
        <div className="home-page">

            <div className="background-glow"></div>

            <Header />

            <main className="posts-container">

                <PostCard />
                <PostCard />
                <PostCard />

            </main>

        </div>
    )
}

export default HomePage