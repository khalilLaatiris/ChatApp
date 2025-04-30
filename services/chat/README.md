# Chat Service

## Service Overview

The Chat Service provides real-time chat functionality using WebSockets. It allows users to send and receive messages, which are broadcasted to all connected clients. Messages are also stored in a SQLite database.

## Prerequisites

*   Node.js
*   npm

## Installation Steps

1.  Clone the repository.
2.  Navigate to the `services/chat` directory.
3.  Run `npm install` to install dependencies.

## Environment Variables

*   `PORT`: Port on which the service will run (default: 3001).

## Endpoints/Functionality

*   WebSocket connection: Establishes a WebSocket connection with the server.
*   `chat message` event: Allows users to send messages to the server, which are then broadcasted to all connected clients.

## Testing Procedures

1.  Use `npm test` to run the unit tests.

## Contribution Notes

Please follow the existing code style and conventions. Ensure all tests pass before submitting a pull request.