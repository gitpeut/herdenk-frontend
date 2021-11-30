

function accessToTitle( access ) {
    
    const titleMap = {
        READ: 'U kunt dit graf bekijken maar geen reacties plaatsen',
        PUBLIC: 'U kunt dit graf bekijken maar geen reacties plaatsen',
        WRITE: 'U kunt dit graf bekijken en reacties plaatsen',
        OWNER: 'U bent eigenaar van dit graf',
        NONE:  'U heeft pas toegang tot dit graf als u toestemming hebt gevraagd en gekregen',
    }

    return titleMap[ access ] ? titleMap[access]: 'Graf';
}

export default accessToTitle;