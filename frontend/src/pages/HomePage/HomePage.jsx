import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import PostCard from '../../components/PostCard/PostCard'
import { getPostsWithCommentCounts, searchPostsWithCommentCounts } from '../../api/client'

function HomePage() {
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('q')?.trim() ?? ''
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true

        async function loadPosts() {
            try {
                const loadedPosts = searchQuery
                    ? await searchPostsWithCommentCounts(searchQuery)
                    : await getPostsWithCommentCounts()

                if (isMounted) {
                    setPosts(loadedPosts)
                    setError('')
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message)
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadPosts()

        return () => {
            isMounted = false
        }
    }, [searchQuery])

    return (
        <div className="home-page">

            <div className="background-glow"></div>

            <Header />

            <main className="posts-container">

                {isLoading && (
                    <p className="feed-state">
                        Loading posts...
                    </p>
                )}

                {!isLoading && error && (
                    <p className="feed-state feed-state-error">
                        {error}
                    </p>
                )}

                {!isLoading && !error && posts.length === 0 && (
                    <p className="feed-state">
                        {searchQuery ? 'No posts found.' : 'No posts yet.'}
                    </p>
                )}

                {!isLoading && !error && posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

            </main>

        </div>
    )
}

export default HomePage
