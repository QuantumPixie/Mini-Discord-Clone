import ChannelList from '../ChannelList/ChannelList'
import UserList from '../UserList/UserList'
import Avatar from '../Avatar/Avatar'
import './Sidebar.css'

const Sidebar = ({
  channels,
  users,
  currentChannel,
  onChannelSelect,
  onDisconnect,
  onLeaveServer,
  currentUser,
  isConnected,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <ChannelList
          channels={channels}
          currentChannel={currentChannel}
          onChannelSelect={onChannelSelect}
          isConnected={isConnected}
        />
        <UserList users={users} />
      </div>
      {currentUser && (
        <div className="user-info">
          <div className="user-profile">
            <div className="avatar-container">
              <Avatar username={currentUser.name} size="medium" />
              <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}></div>
            </div>
            <span className="username">{currentUser.name}</span>
          </div>
          <div className="user-actions">
            <button onClick={onDisconnect} className="disconnect-button" disabled={!isConnected}>
              Disconnect
            </button>
            <button onClick={onLeaveServer} className="leave-button" disabled={!isConnected}>
              Leave Server
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
