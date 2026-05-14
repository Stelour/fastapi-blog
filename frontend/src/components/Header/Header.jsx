import './Header.css'
import searchIcon from '../../assets/icons/search.svg'
import plusIcon from '../../assets/icons/plus.svg'
import userIcon from '../../assets/icons/user.svg'

function Header() {

    return (
        <header className="header">

            <h1 className="logo">
                BLOG
            </h1>

            <div className="search">

                <div className="search-icon">
                  <img src={searchIcon} alt=""/>
                </div>

                <hr/>

                <input
                    type="text"
                    placeholder="Search posts..."
                />

            </div>

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