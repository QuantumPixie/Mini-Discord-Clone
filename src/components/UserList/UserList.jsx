import Avatar from '../Avatar/Avatar'
import './UserList.css'

const UserList = ({ users }) => {
  const onlineUsers = users.filter(user => user.connected)
  const offlineUsers = users.filter(user => !user.connected)

  const renderUserSection = (sectionUsers, sectionTitle) => (
    <div className="user-section">
      <h3 className="user-section-title">
        {sectionTitle} — {sectionUsers.length}
      </h3>
      <ul className="user-list">
        {sectionUsers.map(user => (
          <li key={user.userId} className="user-item">
            <div className={`user-status ${user.connected ? 'online' : 'offline'}`}></div>
            <Avatar username={user.username} size="small" />
            <span className="user-name">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="user-list-container">
      <h2 className="user-list-header">Users</h2>
      {renderUserSection(onlineUsers, 'Online')}
      {renderUserSection(offlineUsers, 'Offline')}
    </div>
  )
}

export default UserList
