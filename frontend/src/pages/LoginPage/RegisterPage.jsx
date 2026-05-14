import './LoginPage.css'
import userIcon from '../../assets/icons/user.svg'
import { Link } from "react-router-dom"

function RegisterPage() {
    return (
        <div className="login-page">

            <div className="glow"></div>

            <h1 className="blog-title">BLOG</h1>

            <div className="login-card">

                <div className="avatar-login">
                    <img src={userIcon} alt="user" />
                </div>

                <form className="login-form">

                    <h2 className="login-title">Register</h2>

                    <div className="input-group">

                        <input
                            type="email"
                            placeholder="Email"
                        />

                        <input
                            type="text"
                            placeholder="Login"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                        />

                    </div>

                    <button type="submit" className="submit-btn">
                        Register
                    </button>

                </form>

            </div>

            <small className="bottom">Already have an account?

                <Link className="bottom-link" to="/login">
                    Log in
                </Link>

            </small>

        </div>
    )
}

export default RegisterPage