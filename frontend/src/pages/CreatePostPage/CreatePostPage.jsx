import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { createPost } from '../../api/client'
import './CreatePostPage.css'

function CreatePostPage() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

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
            const post = await createPost({
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

            <main className="create-post-card">
                <form className="create-post-form" onSubmit={handleSubmit}>
                    <h1>Create Post</h1>

                    <input
                        className="create-title-input"
                        type="text"
                        placeholder="Title..."
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={200}
                        required
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
                    />

                    {error && (
                        <p className="create-post-error">
                            {error}
                        </p>
                    )}

                    <button className="create-post-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create post'}
                    </button>
                </form>
            </main>
        </div>
    )
}

export default CreatePostPage
