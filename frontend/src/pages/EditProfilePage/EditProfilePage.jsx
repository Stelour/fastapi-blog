import './EditProfilePage.css'
import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import userImage from '../../assets/icons/user-big.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { getCurrentUserProfile, getFileUrl, updateProfile } from '../../api/client'

function EditProfilePage() {
    const { publicId } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [newPublicId, setNewPublicId] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [preview, setPreview] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true

        getCurrentUserProfile()
            .then((currentProfile) => {
                if (!isMounted) {
                    return
                }

                if (!currentProfile || currentProfile.public_id !== publicId) {
                    setError('You can edit only your own profile.')
                    return
                }

                setProfile(currentProfile)
                setUsername(currentProfile.username)
                setBio(currentProfile.bio ?? '')
                setNewPublicId(currentProfile.public_id ?? '')
                setPreview(currentProfile.avatar_path ? getFileUrl(currentProfile.avatar_path) : userImage)
                setError('')
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message)
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [publicId])

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0] ?? null
        setAvatar(file)

        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleEdit = async (event) => {
        event.preventDefault()

        setIsSubmitting(true)
        setError('')

        try {
            const updatedProfile = await updateProfile(profile.public_id, {
                username: username.trim(),
                bio,
                newPublicId: newPublicId.trim(),
                avatar,
            })

            navigate(`/profile/${updatedProfile.public_id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="edit-profile-page">

            <div className="background-glow"></div>

            <Header />

            {isLoading && (
                <p className="feed-state">
                    Loading profile...
                </p>
            )}

            {!isLoading && error && !profile && (
                <p className="feed-state feed-state-error">
                    {error}
                </p>
            )}

            {!isLoading && profile && (
                <div className="edit-profile-card">

                    <label className="edit-avatar-picker">
                        <img
                            src={preview || userImage}
                            alt=""
                            className="edit-profile-image"
                            onError={(event) => {
                                event.currentTarget.onerror = null
                                event.currentTarget.src = userImage
                            }}
                        />
                        <input type="file" accept="image/*" onChange={handleAvatarChange} />
                    </label>

                    <form className="edit-form" onSubmit={handleEdit}>

                        <div className="input-group">

                            <h1>Edit Profile</h1>

                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />

                            <input
                                type="text"
                                placeholder="Bio"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="UserID"
                                value={newPublicId}
                                onChange={(event) => setNewPublicId(event.target.value)}
                                required
                            />

                        </div>

                        {error && (
                            <p className="edit-profile-error">
                                {error}
                            </p>
                        )}

                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Edit'}
                        </button>

                    </form>

                </div>
            )}

        </div>
    )
}

export default EditProfilePage
