import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Header.css'
import searchIcon from '../../assets/icons/search.svg'
import plusIcon from '../../assets/icons/plus.svg'
import userIcon from '../../assets/icons/user.svg'

function Header() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')

    const handleSearchSubmit = (event) => {
        event.preventDefault()

        const query = searchQuery.trim()
        navigate(query ? `/?q=${encodeURIComponent(query)}` : '/')
    }

    return (
        <header className="header">

            <h1 className="logo">
                BLOG
            </h1>

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

                <button className="header-btn">
                    <img src={searchIcon} alt=""/>
                    PROFILES
                </button>

                <button className="header-btn">
                    <img src={plusIcon} alt=""/>
                    CREATE
                </button>

                <div className="avatar">
                    <img src={userIcon} alt=""/>
                </div>

            </div>

        </header>
    )
}

export default Header
