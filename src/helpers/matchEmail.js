// Stricter email address checker as found on
//https://emailregex.com/

function matchEmail(candidate) {
    // disable complaint of eslint on Unnecessary escape character
    // eslint-disable-next-line
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return (candidate.match(emailRegex));
}

export default matchEmail;