
function formatDate( IsoDateString ){

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    const date = new Date( IsoDateString );
    return date.toLocaleString('nl-NL', dateOptions);
}

export default formatDate;