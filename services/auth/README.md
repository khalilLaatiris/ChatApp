# Auth Service

## Service Overview

The Auth Service is responsible for handling user registration and authentication. It provides endpoints for user registration and login, issuing JWT tokens upon successful authentication.

## Prerequisites

*   Node.js
*   npm

## Installation Steps

1.  Clone the repository.
2.  Navigate to the `services/auth` directory.
3.  Run `npm install` to install dependencies.

## Environment Variables

*   `JWT_SECRET`: Secret key used to sign JWT tokens.
*   `PORT`: Port on which the service will run (default: 3000).

## Endpoints/Functionality

*   `POST /register`: Registers a new user. Requires `email` and `password` in the request body.
*   `POST /login`: Logs in an existing user. Requires `email` and `password` in the request body. Returns a JWT token.

## Testing Procedures

1.  Use `npm test` to run the unit tests.

## Contribution Notes

Please follow the existing code style and conventions. Ensure all tests pass before submitting a pull request.