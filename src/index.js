const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.piso)

        socket.emit('message', generateMessage('Hora atual:', 'Bem vindo!'))
        socket.broadcast.to(user.piso).emit('message', generateMessage('Hora de entrada:', `O lugar ${user.lugar} foi ocupado!`))
        io.to(user.piso).emit('roomData', {
            piso: user.piso,
            users: getUsersInRoom(user.piso)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()


        io.to(user.piso).emit('message', generateMessage(user.lugar, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
       socket.emit('locationMessage', generateLocationMessage(user.lugar, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {ída:
            io.to(user.piso).emit('message', generateMessage('Hora de saída:', `O lugar ${user.lugar} foi desocupado!`))
            io.to(user.piso).emit('roomData', {
                piso: user.piso,
                users: getUsersInRoom(user.piso)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})