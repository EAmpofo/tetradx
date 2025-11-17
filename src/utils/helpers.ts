

export const formatDate = (date: string) => {
    // format data as "Jan 15, 2025"
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
}