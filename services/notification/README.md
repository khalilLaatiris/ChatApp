# Notification Service

## Service Overview

The Notification Service is responsible for sending and retrieving notifications for users. It provides endpoints for sending notifications to specific users and retrieving notifications for a given user.

## Prerequisites

*   Node.js
*   npm

## Installation Steps

1.  Clone the repository.
2.  Navigate to the `services/notification` directory.
3.  Run `npm install` to install dependencies.

## Environment Variables

*   `PORT`: Port on which the service will run (default: 3002).

## Endpoints/Functionality

*   `POST /notifications`: Sends a notification to a user. Requires `user` and `message` in the request body.
*   `GET /notifications/:user`: Retrieves all notifications for a specific user.

## Testing Procedures

1.  Use `npm test` to run the unit tests.

## Contribution Notes

Please follow the existing code style and conventions. Ensure all tests pass before submitting a pull request.