export function formatDateTime(value) {
    if (!value) {
        return ''
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

export function truncateText(value, maxLength) {
    if (!value || value.length <= maxLength) {
        return value ?? ''
    }

    return `${value.slice(0, maxLength).trim()}...`
}
