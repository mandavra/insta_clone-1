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

curl -X POST https://insta-clone-1-fqbz.onrender.com/api/v1/user/register \
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

# Post Add Endpoint Documentation

## Endpoint: `/api/v1/posts/addpost`

### Description
This endpoint is used to add a new post. It requires the user to provide an image and optionally a caption. The image will be optimized and uploaded to a cloud storage.

### Method
`POST`

### Request Headers
- `Authorization` (string, required): The JWT token for user authentication.

### Request Body
The request body should be in `multipart/form-data` format and include the following fields:

- `image` (file, required): The image file to be uploaded.
- `caption` (string, optional): The caption for the post.

Example:
```sh
curl -X POST https://insta-clone-1-fqbz.onrender.com/api/v1/posts/addpost \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "image=@/path/to/your/image.jpg" \
  -F "caption=This is a new post"


  {
  "message": "New post added",
  "post": {
    "caption": "This is a new post",
    "image": "https://cloudinary.com/your_image_url",
    "author": {
      "username": "john_doe",
      "profilePicture": "https://cloudinary.com/your_profile_picture_url"
    },
    "likes": [],
    "comments": []
  },
  "success": true
}


{
  "message": "Image required",
  "success": false
}

curl -X POST https://insta-clone-1-fqbz.onrender.com/api/v1/posts/addpost \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "image=@/path/to/your/image.jpg" \
  -F "caption=This is a new post"


  {
  "message": "New post added",
  "post": {
    "caption": "This is a new post",
    "image": "https://cloudinary.com/your_image_url",
    "author": {
      "username": "john_doe",
      "profilePicture": "https://cloudinary.com/your_profile_picture_url"
    },
    "likes": [],
    "comments": []
  },
  "success": true
}