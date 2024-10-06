import './ChannelList.css'

const ChannelList = ({ channels, currentChannel, onChannelSelect }) => (
  <div>
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
  </div>
)

export default ChannelList
