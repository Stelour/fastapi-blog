import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { getCurrentUser, getPost, updatePost } from '../../api/client'
import '../CreatePostPage/CreatePostPage.css'

function EditPostPage() {
    const { postId } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true

        Promise.all([
            getPost(postId),
            getCurrentUser(),
        ])
            .then(([post, currentUser]) => {
                if (!isMounted) {
                    return
                }

                if (post.author_id !== currentUser.id) {
                    setError('You can edit only your own posts.')
                    return
                }

                setTitle(post.title)
                setBody(post.body)
                setCategories(post.categories)
                setError('')
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message)
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [postId])

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase()

        if (!tag || categories.includes(tag)) {
            setTagInput('')
            return
        }

        setCategories((currentCategories) => [...currentCategories, tag])
        setTagInput('')
    }

    const handleTagKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault()
            addTag()
        }
    }

    const removeTag = (tagToRemove) => {
        setCategories((currentCategories) => (
            currentCategories.filter((category) => category !== tagToRemove)
        ))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setIsSubmitting(true)
        setError('')

        try {
            const post = await updatePost(postId, {
                title: title.trim(),
                body: body.trim(),
                categories,
            })

            navigate(`/post/${post.id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="create-post-page">
            <div className="background-glow"></div>

            <Header />

            {isLoading && (
                <p className="feed-state">
                    Loading post...
                </p>
            )}

            {!isLoading && (
                <main className="create-post-card">
                    <form className="create-post-form" onSubmit={handleSubmit}>
                        <h1>Edit Post</h1>

                        <input
                            className="create-title-input"
                            type="text"
                            placeholder="Title..."
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            maxLength={200}
                            required
                            disabled={Boolean(error) && !title}
                        />

                        <div className="tags-editor">
                            {categories.map((category) => (
                                <button
                                    className="tag-chip"
                                    type="button"
                                    key={category}
                                    onClick={() => removeTag(category)}
                                >
                                    {category}
                                </button>
                            ))}

                            <input
                                type="text"
                                placeholder="+ new tag..."
                                value={tagInput}
                                onBlur={addTag}
                                onChange={(event) => setTagInput(event.target.value)}
                                onKeyDown={handleTagKeyDown}
                            />
                        </div>

                        <textarea
                            placeholder="Body..."
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            required
                            disabled={Boolean(error) && !body}
                        />

                        {error && (
                            <p className="create-post-error">
                                {error}
                            </p>
                        )}

                        <button
                            className="create-post-submit"
                            type="submit"
                            disabled={isSubmitting || (Boolean(error) && !title)}
                        >
                            {isSubmitting ? 'Saving...' : 'Save post'}
                        </button>
                    </form>
                </main>
            )}
        </div>
    )
}

export default EditPostPage
