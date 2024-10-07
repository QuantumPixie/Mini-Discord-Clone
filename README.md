## Discord Mini Clone

This project is a simplified clone of Discord, built using React and Socket.IO.
It demonstrates real-time communication features in a chat application.

## Features

- Real-time messaging using WebSockets
- Multiple channels support
- User presence (online/offline status)
- Session management

## Tech Stack

Frontend: React (with Vite as the build tool)

Backend: Node.js with Express

Real-time Communication: Socket.IO

## Setup and Installation

**Clone the repository:**

```git clone https://github.com/QuantumPixie/Mini-Discord-Clone.git
cd mini-discord-clone-starter-kit git
```

**Install dependencies:**

```npm install

```

**Start the WebSocket server:**

```npm run server

```

**In a separate terminal, start the React development server:**

```npm run dev

```

**Open your browser and navigate to http://localhost:5177 (or the port specified by Vite).**

## WebSocket Events

The application supports various WebSocket events for real-time communication:

- connect: Emitted when a WebSocket connection is established
- session: Emitted when a session is initialized
- channels: Returns a list of channels with their messages
- message:channel: Emitted when a message is sent to a channel
- users: Returns a list of users (online and offline)
- user:join: Emitted when a new user joins the server
- user:disconnect: Emitted when a user disconnects
- disconnect: Emitted when the WebSocket connection is closed

For more details on event usage, refer to the server.cjs file.

## Development

- The project uses Vite for fast development and building.
- ESLint and Prettier are configured for code linting and formatting.
- The @ alias is set up for importing from the src directory.

**Useful Commands**
```
npm run dev: Start the development server
npm run build: Build the production-ready application
npm run lint: Run ESLint
npm run format: Format code using Prettier
npm run preview: Preview the production build locally
npm run server: Start the WebSocket server
```

**Note on State Persistence**

User list, sessions, and messages are stored in memory. Data is lost when the WebSocket server is restarted.
