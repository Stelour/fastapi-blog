import {
    createBrowserRouter,
} from 'react-router-dom'

import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/LoginPage/RegisterPage'
import HomePage from '../pages/HomePage/HomePage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage'
import PostPage from '../pages/PostPage/PostPage'
import SearchProfilesPage from '../pages/SearchProfilesPage/SearchProfilesPage'
import CreatePostPage from '../pages/CreatePostPage/CreatePostPage'
import EditPostPage from '../pages/EditPostPage/EditPostPage'

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
        path: '/profile/:publicId',
        element: <ProfilePage />,
    },

    {
        path: '/profile/edit',
        element: <EditProfilePage />
    },

    {
        path: '/profile/:publicId/edit',
        element: <EditProfilePage />
    },

    {
        path: '/profiles/search',
        element: <SearchProfilesPage />
    },

    {
        path: '/posts/create',
        element: <CreatePostPage />
    },

    {
        path: '/post',
        element: <PostPage />
    },

    {
        path: '/post/:postId',
        element: <PostPage />
    },

    {
        path: '/post/:postId/edit',
        element: <EditPostPage />
    }
])
