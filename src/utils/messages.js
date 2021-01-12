const generateMessage = (lugar, text) => {
    return {
        lugar,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (lugar, url) => {
    return {
        lugar,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}