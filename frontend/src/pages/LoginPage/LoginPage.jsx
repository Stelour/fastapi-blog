import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'
import userIcon from '../../assets/icons/user.svg'
import { loginUser, saveToken } from '../../api/client'

function LoginPage() {
    const navigate = useNavigate()
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setIsSubmitting(true)
        setError('')

        try {
            const token = await loginUser(login.trim(), password)
            saveToken(token.access_token)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="login-page">

            <div className="glow"></div>

            <h1 className="blog-title">BLOG</h1>

            <div className="login-card">

                <div className="avatar-login">
                    <img src={userIcon} alt="user" />
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    <h2 className="login-title">Login</h2>

                    <div className="input-group">

                        <input
                            type="text"
                            placeholder="Email / Login"
                            value={login}
                            onChange={(event) => setLogin(event.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                    </div>

                    {error && (
                        <p className="auth-message auth-message-error">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Log in'}
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
