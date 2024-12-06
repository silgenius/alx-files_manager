# alx-files_manager

This repository is the final project for the back-end trimester at ALX and it demonstrates a simple file management platform. The project integrates key back-end technologies such as authentication, NodeJS, MongoDB, Redis, and background processing. It includes functionalities for file upload, viewing, and management.

## Features

- **User Authentication**: Secure user authentication via tokens (JWT).
- **File Management**:
  - List all files stored in the system.
  - Upload new files to the platform.
  - Change the permission settings of a file.
  - View details of a specific file.
  - Generate thumbnails for image files.

## Technologies Used

- **Node.js**: JavaScript runtime for building the back-end server.
- **MongoDB**: NoSQL database to store file and user data.
- **Redis**: Caching system used for improving performance and background task handling.
- **JWT (JSON Web Token)**: For user authentication and maintaining secure sessions.
- **Multer**: Middleware for handling file uploads.
- **Sharp**: Library to generate image thumbnails.
- **Pagination**: Implementation to list files with pagination support.

## Installation

To get started with this project locally, follow the steps below:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/alx-files_manager.git
   cd alx-files_manager
   ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables by creating a `.env` file in the root directory with the following variables:
    ```makefile
    MONGO_URI=your_mongodb_connection_string
    REDIS_HOST=localhost
    REDIS_PORT=6379
    JWT_SECRET=your_jwt_secret
    ```
    
4. Start the application:
    ```bash
    npm start
    ```

## Author 

- [Martin Olutade](https://github.com/silgenius/)