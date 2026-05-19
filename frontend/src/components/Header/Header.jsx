import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './Header.css'
import searchIcon from '../../assets/icons/search.svg'
import plusIcon from '../../assets/icons/plus.svg'
import userIcon from '../../assets/icons/user.svg'
import { getCurrentUserProfile, getFileUrl, logoutUser } from '../../api/client'

function Header() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
    const [currentProfile, setCurrentProfile] = useState(null)

    useEffect(() => {
        let isMounted = true

        getCurrentUserProfile()
            .then((profile) => {
                if (isMounted) {
                    setCurrentProfile(profile)
                }
            })
            .catch(() => {
                if (isMounted) {
                    setCurrentProfile(null)
                }
            })

        return () => {
            isMounted = false
        }
    }, [])

    const handleSearchSubmit = (event) => {
        event.preventDefault()

        const query = searchQuery.trim()
        navigate(query ? `/?q=${encodeURIComponent(query)}` : '/')
    }

    const handleAvatarClick = () => {
        if (currentProfile?.public_id) {
            navigate(`/profile/${currentProfile.public_id}`)
        } else {
            navigate('/login')
        }
    }

    const handleLogout = () => {
        logoutUser()
        setCurrentProfile(null)
        navigate('/login')
    }

    const avatarSrc = currentProfile?.avatar_path ? getFileUrl(currentProfile.avatar_path) : userIcon

    return (
        <header className="header">

            <Link className="logo" to="/">
                BLOG
            </Link>

            <form className="search" onSubmit={handleSearchSubmit}>

                <button className="search-icon" type="submit">
                  <img src={searchIcon} alt=""/>
                </button>

                <hr/>

                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />

            </form>

            <div className="header-right">

                <button className="header-btn" type="button" onClick={() => navigate('/profiles/search')}>
                    <img src={searchIcon} alt=""/>
                    PROFILES
                </button>

                <button className="header-btn" type="button" onClick={() => navigate('/posts/create')}>
                    <img src={plusIcon} alt=""/>
                    CREATE
                </button>

                {currentProfile && (
                    <button className="header-btn logout-btn" type="button" onClick={handleLogout}>
                        LOGOUT
                    </button>
                )}

                <button className="avatar" type="button" onClick={handleAvatarClick}>
                    <img
                        src={avatarSrc}
                        alt=""
                        onError={(event) => {
                            event.currentTarget.onerror = null
                            event.currentTarget.src = userIcon
                        }}
                    />
                </button>

            </div>

        </header>
    )
}

export default Header
