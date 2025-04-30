# Frontend Service

## Service Overview

The Frontend Service is a React application that provides the user interface for the chat application. It handles user authentication, manages application state using Redux, and communicates with the Chat Service using WebSockets.

## Prerequisites

*   Node.js
*   npm

## Installation Steps

1.  Clone the repository.
2.  Navigate to the `services/frontend` directory.
3.  Run `npm install` to install dependencies.
4.  Run `npm start` to start the development server.

## Environment Variables

The Frontend Service does not require any specific environment variables. However, it relies on the Chat Service and Auth Service being available at their respective addresses.

## Endpoints/Functionality

*   `/login`: Login page.
*   `/register`: Registration page.
*   `/`: Chat page (protected route, requires authentication).

## Testing Procedures

1.  Use `npm test` to run the unit tests.

## Contribution Notes

Please follow the existing code style and conventions. Ensure all tests pass before submitting a pull request.
