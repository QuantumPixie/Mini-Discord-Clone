import { useState, useRef, useEffect } from 'react'
import Avatar from '../Avatar/Avatar'
import './ChatArea.css'

const ChatArea = ({ currentChannel, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = e => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  return (
    <div className="chat-area">
      <div className="chat-header"># {currentChannel}</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={message.id || index} className="message">
            <div className="message-header">
              <Avatar username={message.username} size="medium" />
              <div className="message-info">
                <span className="username">{message.username}</span>
                <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <p className="message-content">{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder={`Message #${currentChannel}`}
        />
      </form>
    </div>
  )
}

export default ChatArea
