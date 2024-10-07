import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Login from './components/Login/Login'
import Sidebar from './components/Sidebar/Sidebar'
import ChatArea from './components/ChatArea/ChatArea'
import './App.css'

const App = () => {
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)
  const [channels, setChannels] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:8181', {
        auth: { username: user.name },
      })

      newSocket.on('connect', () => {
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
        setUsers([])
        setChannels([]) 
        setCurrentChannel(null)
        setMessages([])
      })

      newSocket.on('connect_error', () => {
        setIsConnected(false)
      })

      newSocket.on('channels', serverChannels => {
        setChannels(serverChannels)
        if (serverChannels.length > 0) {
          setCurrentChannel(serverChannels[0].name)
        }
      })

      newSocket.on('users', serverUsers => {
        setUsers(serverUsers.map(user => ({ ...user, connected: user.connected ?? true })))
      })

      newSocket.on('message:channel', (channel, message) => {
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

      newSocket.on('user:join', userData => {
        setUsers(prevUsers => {
          const userExists = prevUsers.some(u => u.userId === userData.userId)
          if (userExists) {
            return prevUsers.map(u =>
              u.userId === userData.userId ? { ...u, connected: true } : u,
            )
          } else {
            return [...prevUsers, { ...userData, connected: true }]
          }
        })
      })

      newSocket.on('user:disconnected', userData => {
        setUsers(prevUsers =>
          prevUsers.map(u => (u.userId === userData.userId ? { ...u, connected: false } : u)),
        )
      })

      newSocket.on('user:leave', userData => {
        setUsers(prevUsers => prevUsers.filter(u => u.userId !== userData.userId))
      })

      newSocket.on('user:reconnect', userData => {
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
    })
  }

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect()
    }
    setUser(null)
    setSocket(null)
    setCurrentChannel(null)
    setUsers([])
    setChannels([])
    setMessages([])
    setIsConnected(false)
  }

  const handleLeaveServer = () => {
    if (socket) {
      socket.emit('user:leave')
      socket.disconnect()
    }
    setUser(null)
    setSocket(null)
    setCurrentChannel(null)
    setUsers([])
    setChannels([])
    setMessages([])
    setIsConnected(false)
  }

  const handleSendMessage = content => {
    if (socket && currentChannel) {
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
        isConnected={isConnected}
      />
      <ChatArea
        currentChannel={currentChannel}
        messages={messages.filter(m => m.channel === currentChannel)}
        onSendMessage={handleSendMessage}
        currentUser={user}
        isConnected={isConnected}
      />
    </div>
  )
}

export default App
