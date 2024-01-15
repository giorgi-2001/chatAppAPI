require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const corsOptions = require('./config/corsOptions')
const { Server } = require('socket.io')
 
const app = express()

app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)

app.use('*', express.static('public'))

port = process.env.PORT || 3000

const server = app.listen(port, console.log(`Server started on port - ${port}, connected to MongoDB`))


const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'https://supachattery.onrender.com'
    }
})

let users = []

io.on("connection", (socket) => {
    console.log('connected to WebSocket')

    socket.on('setup', (userData) => {
        socket.join(userData._id)

        users.push({
           socketId: socket.id,
           _id: userData._id
        })

        io.emit('activeUsers', users)
        console.log(users)
    })

    socket.on('newMessage', ({newMessage, chat}) => {
        if(!chat.users) return console.log('Chat has no users')

        const theOtherGuy = chat.users.find(u => u._id !== newMessage.sender)

        socket.to(theOtherGuy._id).emit('messageRecieved', newMessage)
    
    })


    // typing activity

    socket.on('typing', ({ chat, user }) => {
        const otherGuy = chat.users.find(u => u._id !== user._id)
        socket.to(otherGuy._id).emit('isTyping', chat)
    })

    socket.on('stoppedTyping', ({ chat, user }) => {
        const otherGuy = chat.users.find(u => u._id !== user._id)
        socket.to(otherGuy._id).emit('notTyping')
    })


    socket.on('logout', (userData) => {
        socket.leave(userData._id)
        users = users.filter(user => user._id !== userData._id)
        io.emit('activeUsers', users)
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
        io.emit('activeUsers', users)
    })

    socket.off('setup', () => {
        console.log('User Disconnected')
        socket.leave(userData._id)
    })
})

mongoose.connect(process.env.MONGO_URI).then(server)

