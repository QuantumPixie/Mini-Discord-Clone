/* eslint-disable no-undef */
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const { generateRandomId } = require('./server/utils.cjs')
const { initializeStore } = require('./server/sessions.cjs')
const { initializeChannel } = require('./server/channels.cjs')
const { buildMessage } = require('./server/messages.cjs')

const app = express()

const server = http.createServer(app)
const port = process.env.PORT || 8181

const io = new socketIo.Server(server, {
  cors: {
    origin: ['http://localhost:5177', 'http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const CHANNEL_NAMES = ['welcome', 'general', 'react', 'learners', 'casual']
const sessions = initializeStore()
const channels = CHANNEL_NAMES.map(channel => initializeChannel(channel))

io.use(async (socket, next) => {
  const username = socket.handshake.auth.username

  if (!username) {
    return next(new Error('Invalid username'))
  }

  socket.sessionId = generateRandomId()
  socket.userId = generateRandomId()
  socket.username = username

  next()
})

io.on('connection', socket => {
  const session = {
    sessionId: socket.sessionId,
    userId: socket.userId,
    username: socket.username,
    connected: true,
  }
  sessions.setSession(socket.sessionId, session)

  socket.emit('session', session)
  io.emit('user:join', session)

  channels.forEach(channel => socket.join(channel.name))
  socket.join(session.userId)

  socket.emit(
    'channels',
    channels.map(channel => ({ name: channel.name })),
  )
  socket.emit('users', sessions.getAllUsers())

  socket.on('message:channel:send', (channel, message) => {
    const registeredChannel = channels.find(it => it.name === channel)

    if (!registeredChannel) return

    const builtMessage = buildMessage(session, message)

    registeredChannel.messages.push(builtMessage)

    io.to(channel).emit('message:channel', channel, builtMessage)
  })

  socket.on('user:leave', acknowledgement => {
    const session = sessions.getSessionById(socket.sessionId)
    if (session) {
      channels.forEach(channel => {
        if (channel.users && Array.isArray(channel.users)) {
          const index = channel.users.indexOf(session.userId)
          if (index !== -1) {
            channel.users.splice(index, 1)
          }
        }
      })

      socket.broadcast.emit('user:leave', session)

      sessions.deleteSession(socket.sessionId)
    }

    if (typeof acknowledgement === 'function') {
      acknowledgement()
    }
  })

  socket.on('disconnect', () => {
    const session = sessions.getSessionById(socket.sessionId)

    if (!session) return

    session.connected = false
    sessions.setSession(socket.sessionId, session)

    io.emit('user:disconnected', session)
  })
})

server.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})
