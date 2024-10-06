import './Avatar.css'

const DiscordIcon = ({ color }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 11.5C32 11.5 28.7 8.9 25 8.5L24.6 9.1C27.6 9.8 29 11 30.4 12.5C27.4 11 24.4 9.8 21.6 9.8C18.8 9.8 15.8 11 12.8 12.5C14.2 11 15.8 9.7 18.6 9.1L18.2 8.5C14.4 8.9 11.2 11.5 11.2 11.5C11.2 11.5 7.7 16.4 6.6 26C9.8 30 15 30.1 15 30.1L16 28.8C14.2 28.2 12.2 27.1 10.4 25.4C12.6 27 15.6 28.7 19.8 28.7C24 28.7 27 27 29.2 25.4C27.4 27.1 25.4 28.2 23.6 28.8L24.6 30.1C24.6 30.1 29.8 30 33 26C31.9 16.4 28.4 11.5 28.4 11.5ZM15.2 23.8C14.1 23.8 13.2 22.7 13.2 21.4C13.2 20.1 14.1 19 15.2 19C16.3 19 17.2 20.1 17.2 21.4C17.2 22.7 16.3 23.8 15.2 23.8ZM26.4 23.8C25.3 23.8 24.4 22.7 24.4 21.4C24.4 20.1 25.3 19 26.4 19C27.5 19 28.4 20.1 28.4 21.4C28.4 22.7 27.5 23.8 26.4 23.8Z"
      fill={color}
    />
  </svg>
)

const Avatar = ({ username, size = 'medium' }) => {
  const color = `hsl(${username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 70%, 50%)`

  return (
    <div className={`avatar avatar-${size}`} style={{ backgroundColor: color }}>
      <div className="icon-container">
        <DiscordIcon color="white" />
      </div>
    </div>
  )
}

export default Avatar
