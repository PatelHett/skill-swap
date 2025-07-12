# Skill Swap Backend

A Node.js/Express backend for the Skill Swap platform that enables users to exchange skills with each other.

## Features

- **User Management**: Registration, authentication, profile management
- **Skills Management**: Create, update, delete, and search skills
- **Swap System**: Create and manage skill swap requests between users
- **Users API**: Comprehensive user search and listing with pagination, filtering, and swap statistics

## API Endpoints

### Authentication (`/api/v1/auth`)

- User registration and login
- Password reset functionality
- Profile management

### Skills (`/api/v1/skills`)

- CRUD operations for skills
- Search and filtering capabilities
- Category-based organization

### Swaps (`/api/v1/swaps`)

- Create swap requests
- Accept/reject/cancel swaps
- View swap history and statistics

### Users (`/api/v1/users`)

- Get all users with pagination and filtering
- Search users by name, email, location, or skills
- Get detailed user profiles with swap history
- Advanced filtering by role, availability, location, and skills

## Documentation

- [Users API Documentation](USERS_API.md) - Complete guide to the Users API
- [Swap API Documentation](SWAP_API.md) - Complete guide to the Swap API
- [Manual Testing Guide](MANUAL_TEST_GUIDE.md) - How to test the APIs manually

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (create a `.env` file):

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY_MS=7200000
   REFRESH_TOKEN_EXPIRY_MS=604800000
   SMTP_USER=your_smtp_email
   SMTP_PASS=your_smtp_password
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Test the APIs:

   ```bash
   # Test users API
   ./test_users_api.sh

   # Test swap API
   ./test_swap_curl.sh
   ```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
├── validators/     # Input validation
└── db/            # Database connection
```
