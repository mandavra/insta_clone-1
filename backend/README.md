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



{
  "message": "Account created successfully.",
  "success": true
}


{
  "message": "Something is missing, please check!",
  "success": false
}
{
  "message": "Try different email",
  "success": false
}

curl -X POST http://localhost:8000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
        "username": "john_doe",
        "email": "john@example.com",
        "password": "securepassword123"
      }'

      {
  "message": "Account created successfully.",
  "success": true
}