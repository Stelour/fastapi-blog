import { Link } from 'react-router-dom'
import './LoginPage.css'
import userIcon from '../../assets/icons/user.svg'

function LoginPage() {
    return (
        <div className="login-page">

            <div className="glow"></div>

            <h1 className="blog-title">BLOG</h1>

            <div className="login-card">

                <div className="avatar-login">
                    <img src={userIcon} alt="user" />
                </div>

                <form className="login-form">

                    <h2 className="login-title">Login</h2>

                    <div className="input-group">

                        <input
                            type="text"
                            placeholder="Email / Login"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                        />

                    </div>

                    <button type="submit" className="submit-btn">
                        Log in
                    </button>

                </form>

            </div>

            <small className="bottom">No account?

                <Link className="bottom-link" to="/register">
                    Register
                </Link>

            </small>

        </div>
    )
}

export default LoginPage