const users = []

const addUser = ({ id, lugar, piso }) => {
    // Clean the data
   // lugar = lugar.trim().toLowerCase()
    //piso = piso.trim().toLowerCase()

    // Validate the data
    if (!lugar || !piso) {
        return {
            error: 'Preencha os campos !'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.piso === piso && user.lugar === lugar
    })

    // Validate lugar
    if (existingUser) {
        return {
            error: 'Lugar ja está ocupado!'
        }
    }

    // Store user
    const user = { id, lugar, piso }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (piso) => {
    piso = piso.trim().toLowerCase()
    return users.filter((user) => user.piso === piso)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}