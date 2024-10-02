import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Login from './Login/Login'
import Sidebar from './Sidebar/Sidebar'
import ChatArea from './Chatarea/ChatArea'
import './App.css'

const App = () => {
  console.log('render')
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)
  const [channels, setChannels] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:8181', {
        auth: { username: user.name },
      })

      newSocket.on('connect', () => {
        console.log('Connected to server')
      })

      newSocket.on('channels', serverChannels => {
        console.log('Received channels:', serverChannels)
        setChannels(serverChannels)
        if (serverChannels.length > 0) {
          setCurrentChannel(serverChannels[0].name)
        }
      })

      newSocket.on('users', serverUsers => {
        console.log('Received users:', serverUsers)
        setUsers(serverUsers)
      })

      newSocket.on('message:channel', (channel, message) => {
        console.log('Received message:', channel, message)
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: message.id,
            channel: channel,
            content: message.message,
            username: message.username,
            timestamp: new Date().toISOString(),
          },
        ])
      })

      newSocket.on('user:leave', userData => {
        console.log('User left:', userData)
        setUsers(prevUsers => prevUsers.filter(user => user.userId !== userData.userId))
      })

      newSocket.on('user:disconnect', userData => {
        console.log('User disconnected:', userData)
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.userId === userData.userId ? { ...user, connected: false } : user,
          ),
        )
      })

      newSocket.on('user:reconnect', userData => {
        console.log('User reconnected:', userData)
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.userId === userData.userId ? { ...user, connected: true } : user,
          ),
        )
      })

      setSocket(newSocket)

      return () => newSocket.close()
    }
  }, [user])

  const handleLogin = username => {
    setUser({
      name: username,
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`,
    })
  }

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect()
    }
    setUser(null)
    setSocket(null)
    setChannels([])
    setCurrentChannel(null)
    setUsers([])
    setMessages([])
  }

  const handleLeaveServer = () => {
    if (socket) {
      socket.emit('user:leave')
      socket.disconnect()
    }
    setUser(null)
    setSocket(null)
    setChannels([])
    setCurrentChannel(null)
    setUsers([])
    setMessages([])
  }

  const handleSendMessage = content => {
    if (socket && currentChannel) {
      console.log('Sending message:', currentChannel, content)
      socket.emit('message:channel:send', currentChannel, content)
    }
  }

  const handleChannelSelect = channelName => {
    setCurrentChannel(channelName)
    if (socket) {
      socket.emit('channel:join', channelName)
    }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <Sidebar
        channels={channels}
        users={users}
        currentChannel={currentChannel}
        onChannelSelect={handleChannelSelect}
        onDisconnect={handleDisconnect}
        onLeaveServer={handleLeaveServer}
        currentUser={user}
      />
      <ChatArea
        currentChannel={currentChannel}
        messages={messages.filter(m => m.channel === currentChannel)}
        onSendMessage={handleSendMessage}
        currentUser={user}
      />
    </div>
  )
}

export default App
