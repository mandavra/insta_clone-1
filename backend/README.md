# User Registration Endpoint Documentation

## Endpoint: `/api/v1/user/register`

### Description
This endpoint is used to register a new user. It requires the user to provide a username, email, and password. The endpoint will hash the password before storing it in the database.

### Method
`POST`

### Request Body
The request body should be in JSON format and include the following fields:

- `username` (string, required): The username of the user.
- `email` (string, required): The email address of the user.
- `password` (string, required): The password of the user.

Example:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}