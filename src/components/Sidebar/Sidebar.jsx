import './Sidebar.css'

const Sidebar = ({
  channels,
  users,
  currentChannel,
  onChannelSelect,
  onDisconnect,
  onLeaveServer,
  currentUser,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2>Channels</h2>
        <ul className="channel-list">
          {channels.map(channel => (
            <li
              key={channel.name}
              className={`channel-item ${currentChannel === channel.name ? 'active' : ''}`}
              onClick={() => onChannelSelect(channel.name)}
            >
              # {channel.name}
            </li>
          ))}
        </ul>
        <h2>Users</h2>
        <ul className="user-list">
          {users.map(user => (
            <li key={user.userId} className="user-item">
              <div className={`user-status ${user.connected ? 'online' : 'offline'}`}></div>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      {currentUser && (
        <div className="user-info">
          <div className="user-profile">
            <img
              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${currentUser.name}`}
              alt={currentUser.name}
              className="avatar"
            />
            <span className="username">{currentUser.name}</span>
          </div>
          <div className="user-actions">
            <button onClick={onDisconnect} className="disconnect-button">
              Disconnect
            </button>
            <button onClick={onLeaveServer} className="leave-button">
              Leave Server
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
