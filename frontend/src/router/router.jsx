import {
    createBrowserRouter,
} from 'react-router-dom'

import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/LoginPage/RegisterPage'
import HomePage from '../pages/HomePage/HomePage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage'
import PostPage from '../pages/PostPage/PostPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },

    {
        path: '/login',
        element: <LoginPage />,
    },

    {
        path: '/register',
        element: <RegisterPage />,
    },

    {
        path: '/profile',
        element: <ProfilePage />,
    },

    {
        path: '/profile/edit',
        element: <EditProfilePage />
    },

    {
        path: '/post',
        element: <PostPage />
    }
])