# User and Profile Management Backend

## Description

This is a backend application for managing user accounts and profiles, built with Node.js, Express, MySQL, and Sequelize. It features user authentication, profile management, and secure API endpoints.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/LoordhuJeyakumar/userandprofilemanagement-be.git
```

2. Navigate to the project directory:
```bash
cd userandprofilemanagement-be
```
3. Install dependencies:
```bash
npm install
```
4. Set up your environment variables in a `.env` file (see [Configuration](#configuration) section).

5. Set up your database and run migrations (if applicable).

## Usage

To start the server:

- Production mode:
```bash
npm start
```
- Development mode:
```bash
npm run dev
```
- Development mode with inspector:
```bash
npm run dev:inspector
```
- Development mode with breakpoint debugging:
```bash
npm run dev:debug
```

## Features

- User registration and authentication
- JWT-based authentication
- User profile management
- Role-based access control
- Email verification
- Password reset functionality
- Profile picture upload (using AWS S3)
- CRUD operations for users and profiles

## API Endpoints

### User Routes

- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - User login
- GET `/api/users/getAllUsers` - Get all users
- GET `/api/users/getUser` - Get current user details (protected)
- PUT `/api/users/updateUser` - Update user details (protected)
- DELETE `/api/users/deleteUser/:id` - Delete a user
- GET `/api/users/verify/:id/:token` - Verify user email
- PUT `/api/users/changePassword` - Change user password (protected)
- PUT `/api/users/deactivateUser` - Deactivate user account (protected)
- DELETE `/api/users/deleteUserAndProfile` - Delete user and associated profile (protected)

### Profile Routes

- GET `/api/profiles/getProfile` - Get user profile (protected)
- PUT `/api/profiles/updateProfile` - Update user profile (protected)
- DELETE `/api/profiles/deleteProfile` - Delete user profile (protected)
- PUT `/api/profiles/updateProfilePicture` - Update profile picture (protected)

## Database Models

### User Model

- `username`: String (required, unique)
- `email`: String (required, unique, validated)
- `password`: String (required)
- `role`: Enum ('user', 'admin')
- `isActive`: Boolean
- `isVerified`: Boolean
- `verificationToken`: String
- `resetPasswordToken`: String
- `resetPasswordExpires`: Date

### Profile Model

- `firstName`: String (required)
- `lastName`: String (required)
- `phoneNumber`: String
- `gender`: Enum ('male', 'female', 'other')
- `profilePicture`: String
- `dateOfBirth`: Date
- `address`: String (required)
- `userId`: Integer (foreign key to User model)

## Configuration

Create a `.env` file in the root directory with the following variables:
```js
PORT=3000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name
```

## Dependencies

- Express
- Sequelize
- MySQL2
- Bcrypt
- JSON Web Token
- Nodemailer
- Multer
- AWS SDK
- Cors
- Dotenv

## Development

- Nodemon (for auto-restarting the server during development)
- Sequelize CLI (for database migrations and seeders)

## Contact

For any queries or support, please contact:

- **Email**: loordhujeyakumar@gmail.com
- **Phone**: +91 9600693684