import { useState } from 'react'
import './LoginPage.css'
import userIcon from '../../assets/icons/user.svg'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, registerUser, saveToken } from '../../api/client'

function RegisterPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setIsSubmitting(true)
        setError('')

        try {
            await registerUser({
                email: email.trim(),
                username: username.trim(),
                password,
            })

            const token = await loginUser(username.trim(), password)
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

                    <h2 className="login-title">Register</h2>

                    <div className="input-group">

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Login"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            minLength={3}
                            maxLength={50}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            minLength={8}
                            maxLength={32}
                            required
                        />

                    </div>

                    {error && (
                        <p className="auth-message auth-message-error">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
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
