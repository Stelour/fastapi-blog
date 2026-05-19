import './ProfilePage.css'

import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import PostCard from '../../components/PostCard/PostCard'
import userImage from '../../assets/icons/user-big.svg'
import editIcon from '../../assets/icons/edit.svg'
import { useNavigate, useParams } from 'react-router-dom'
import {
    getCurrentUserProfile,
    getFileUrl,
    getProfile,
    getUserPostsWithCommentCounts,
} from '../../api/client'
import { formatDateTime } from '../../utils/format'

function ProfilePage() {
    const { publicId } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [currentProfile, setCurrentProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const isOwnProfile = Boolean(profile?.public_id && currentProfile?.public_id === profile.public_id)

    const handleClick = () => {
        navigate(`/profile/${profile.public_id}/edit`)
    }

    useEffect(() => {
        let isMounted = true

        async function loadProfile() {
            if (!publicId) {
                setError('Profile id is missing.')
                setIsLoading(false)
                return
            }

            try {
                const [loadedProfile, loadedPosts, loadedCurrentProfile] = await Promise.all([
                    getProfile(publicId),
                    getUserPostsWithCommentCounts(publicId),
                    getCurrentUserProfile().catch(() => null),
                ])

                if (isMounted) {
                    setProfile(loadedProfile)
                    setPosts(loadedPosts)
                    setCurrentProfile(loadedCurrentProfile)
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

        loadProfile()

        return () => {
            isMounted = false
        }
    }, [publicId])

    return (
        <div className="profile-page">

            <div className="background-glow"></div>

            <Header />

            {isLoading && (
                <p className="feed-state">
                    Loading profile...
                </p>
            )}

            {!isLoading && error && (
                <p className="feed-state feed-state-error">
                    {error}
                </p>
            )}

            {!isLoading && !error && profile && (
                <>
                    <div className="profile-card">

                        <img
                            src={profile.avatar_path ? getFileUrl(profile.avatar_path) : userImage}
                            alt=""
                            className="profile-image"
                            onError={(event) => {
                                event.currentTarget.onerror = null
                                event.currentTarget.src = userImage
                            }}
                        />

                        <div className="profile-info">

                            <div className="username-box">

                                {profile.username}
                                {isOwnProfile && (
                                    <button onClick={handleClick} type="button">
                                        <img src={editIcon} alt=""/>
                                    </button>
                                )}

                            </div>

                            <div className="profile-misc">

                                <span>{profile.bio || 'No bio yet.'}</span>
                                <span>{profile.public_id}</span>
                                <span>Last seen: {formatDateTime(profile.last_seen)}</span>

                            </div>

                        </div>

                    </div>

                    <main className="posts-container">

                        {posts.length === 0 && (
                            <p className="feed-state">
                                No posts yet.
                            </p>
                        )}

                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                    </main>
                </>
            )}

        </div>
    )
}

export default ProfilePage
