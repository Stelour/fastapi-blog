const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
const authorProfileCache = new Map()

async function request(path, options = {}) {
    const { auth = false, ...fetchOptions } = options
    const token = auth ? getStoredToken() : null
    const isFormData = fetchOptions.body instanceof FormData
    const isUrlEncoded = fetchOptions.body instanceof URLSearchParams
    const isJsonBody = fetchOptions.body !== undefined && !isFormData && !isUrlEncoded

    if (auth && !token) {
        throw new Error('Log in to continue.')
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...fetchOptions,
        headers: {
            ...(isFormData ? {} : {}),
            ...(isUrlEncoded ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
            ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...fetchOptions.headers,
        },
    })

    if (!response.ok) {
        let detail = 'Request failed'

        try {
            const data = await response.json()
            detail = data.detail ?? detail
        } catch {
            detail = response.statusText || detail
        }

        throw new Error(Array.isArray(detail) ? detail.map((item) => item.msg).join(', ') : detail)
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}

export function getStoredToken() {
    return localStorage.getItem('access_token') ?? localStorage.getItem('token')
}

export function saveToken(token) {
    localStorage.setItem('access_token', token)
}

export function getFileUrl(path) {
    if (!path) {
        return ''
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`
}

export function getPosts() {
    return request('/posts/')
}

export function searchPosts(query) {
    return request(`/posts/search?q=${encodeURIComponent(query)}`)
}

export async function getPost(postId) {
    return enrichAuthor(await request(`/posts/id/${postId}`))
}

export function getUserPosts(publicId) {
    return request(`/posts/user/${publicId}`)
}

export async function getPostComments(postId) {
    return enrichAuthors(await request(`/posts/posts/${postId}/comments`))
}

export function createComment(postId, body) {
    return request(`/posts/comments/${postId}`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ body }),
    })
}

export function reactPost(postId, value) {
    return request(`/posts/reaction/${postId}`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ value }),
    })
}

export function reactComment(commentId, value) {
    return request(`/posts/comments/reaction/${commentId}`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ value }),
    })
}

export function getProfile(publicId) {
    return request(`/profiles/user/${publicId}`)
}

export function searchProfiles(query) {
    return request(`/profiles/search?q=${encodeURIComponent(query)}`)
}

export function loginUser(login, password) {
    const body = new URLSearchParams()
    body.set('username', login)
    body.set('password', password)

    return request('/auth/login', {
        method: 'POST',
        body,
    })
}

export function registerUser({ email, username, password }) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
    })
}

export async function getPostsWithCommentCounts() {
    const posts = await getPosts()

    return enrichAuthors(await addCommentCounts(posts))
}

export async function searchPostsWithCommentCounts(query) {
    const posts = await searchPosts(query)

    return enrichAuthors(await addCommentCounts(posts))
}

export async function getUserPostsWithCommentCounts(publicId) {
    const posts = await getUserPosts(publicId)

    return enrichAuthors(await addCommentCounts(posts))
}

async function addCommentCounts(posts) {
    const commentsResults = await Promise.allSettled(
        posts.map((post) => getPostComments(post.id))
    )

    return posts.map((post, index) => ({
        ...post,
        comments_count:
            commentsResults[index].status === 'fulfilled'
                ? commentsResults[index].value.length
                : 0,
    }))
}

async function enrichAuthors(items) {
    return Promise.all(items.map((item) => enrichAuthor(item)))
}

async function enrichAuthor(item) {
    const profile = await resolveAuthorProfile(item.author_username)

    if (!profile) {
        return item
    }

    return {
        ...item,
        author_public_id: profile.public_id,
        author_avatar_path: profile.avatar_path,
    }
}

async function resolveAuthorProfile(username) {
    if (!username) {
        return null
    }

    const cacheKey = username.toLowerCase()

    if (!authorProfileCache.has(cacheKey)) {
        authorProfileCache.set(
            cacheKey,
            searchProfiles(username).then((profiles) => (
                profiles.find((profile) => profile.username === username)
                ?? profiles.find((profile) => profile.username.toLowerCase() === cacheKey)
                ?? null
            )).catch(() => null)
        )
    }

    return authorProfileCache.get(cacheKey)
}
