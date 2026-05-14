import './EditProfilePage.css'
import Header from '../../components/Header/Header'
import userImage from '../../assets/icons/user-big.svg'
import { useNavigate } from 'react-router-dom'

function EditProfilePage() {

    const navigate = useNavigate()

    const handleEdit = () => {
        navigate('/profile')
    }

    return (
        <div className="edit-profile-page">

            <div className="background-glow"></div>

            <Header />

            <div className="edit-profile-card">

                    <img src={userImage} alt="" className="edit-profile-image"/>

                <form className="edit-form">

                    <div className="input-group">

                        <h1>Edit Profile</h1>

                        <input
                            type="text"
                            placeholder="Username"
                        />

                        <input
                            type="password"
                            placeholder="Bio"
                        />

                        <input
                            type="password"
                            placeholder="UserID"
                        />

                    </div>

                    <button type="submit" className="submit-btn" onClick={handleEdit}>
                        Edit
                    </button>

                </form>

            </div>

        </div>
    )
}

export default EditProfilePage