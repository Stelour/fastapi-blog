import './ProfilePage.css'

import Header from '../../components/Header/Header'
import PostCard from '../../components/PostCard/PostCard'
import userImage from '../../assets/icons/user-big.svg'
import editIcon from '../../assets/icons/edit.svg'
import {useNavigate} from "react-router-dom";

function ProfilePage() {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/profile/edit')
    }

    return (
        <div className="profile-page">

            <div className="background-glow"></div>

            <Header />

            <div className="profile-card">

                <img src={userImage} alt="" className="profile-image"/>

                <div className="profile-info">

                    <div className="username-box">

                        Username
                        <button onClick={handleClick}>
                            <img src={editIcon} alt=""/>
                        </button>

                    </div>

                    <div className="profile-misc">

                        <span>bio</span>
                        <span>user_id</span>
                        <span>last seen</span>

                    </div>

                </div>

            </div>

            <main className="posts-container">

                <PostCard />
                <PostCard />
                <PostCard />

            </main>

        </div>
    )
}

export default ProfilePage