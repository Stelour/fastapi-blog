import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import userImage from '../../assets/icons/user-big.svg'
import { getFileUrl, searchProfiles } from '../../api/client'
import './SearchProfilesPage.css'

function SearchProfilesPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const initialQuery = searchParams.get('q') ?? ''
    const [query, setQuery] = useState(initialQuery)
    const [profiles, setProfiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const currentQuery = searchParams.get('q')?.trim() ?? ''
        let isMounted = true

        if (!currentQuery) {
            Promise.resolve().then(() => {
                if (isMounted) {
                    setProfiles([])
                    setError('')
                    setIsLoading(false)
                }
            })

            return () => {
                isMounted = false
            }
        }

        searchProfiles(currentQuery)
            .then((loadedProfiles) => {
                if (isMounted) {
                    setProfiles(loadedProfiles)
                    setError('')
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setProfiles([])
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
    }, [searchParams])

    const handleSubmit = (event) => {
        event.preventDefault()

        const trimmedQuery = query.trim()

        if (trimmedQuery) {
            setSearchParams({ q: trimmedQuery })
        } else {
            setSearchParams({})
        }
    }

    return (
        <div className="search-profiles-page">
            <div className="background-glow"></div>

            <Header />

            <form className="profile-search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search profiles..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </form>

            <main className="profiles-results">
                {isLoading && (
                    <p className="profiles-state">
                        Loading profiles...
                    </p>
                )}

                {!isLoading && error && (
                    <p className="profiles-state profiles-state-error">
                        {error}
                    </p>
                )}

                {!isLoading && !error && initialQuery && profiles.length === 0 && (
                    <p className="profiles-state">
                        No profiles found.
                    </p>
                )}

                {!isLoading && !error && profiles.map((profile) => (
                    <Link className="profile-result" to={`/profile/${profile.public_id}`} key={profile.public_id}>
                        <img
                            src={profile.avatar_path ? getFileUrl(profile.avatar_path) : userImage}
                            alt=""
                            onError={(event) => {
                                event.currentTarget.onerror = null
                                event.currentTarget.src = userImage
                            }}
                        />

                        <div className="profile-result-info">
                            <h2>{profile.username}</h2>
                            <span>{profile.public_id}</span>
                            {profile.bio && <p>{profile.bio}</p>}
                        </div>
                    </Link>
                ))}
            </main>
        </div>
    )
}

export default SearchProfilesPage
