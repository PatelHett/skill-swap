# API Integration for ShowSkills Page

## Overview
The ShowSkills page has been successfully integrated with the backend users API to display real user data instead of mock data.

## API Endpoint
- **Base URL**: `https://48x9r4cv-3000.inc1.devtunnels.ms/api/v1`
- **Endpoint**: `/users`
- **Method**: GET

## Query Parameters
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of users per page (default: 10)
- `search` (optional): Search term for username or skills
- `availability` (optional): Filter by availability (weekdays, weekends, evenings, custom)

## Features Implemented

### 1. Real-time Data Fetching
- Fetches users from the backend API
- Displays user profiles with skills offered and wanted
- Shows user availability and other details

### 2. Search Functionality
- Search by username or skill names
- Debounced search to avoid excessive API calls
- Real-time filtering as user types

### 3. Availability Filtering
- Filter users by availability (weekdays, weekends, evenings, custom)
- Dropdown selection for easy filtering

### 4. Pagination
- Server-side pagination
- Shows current page and total pages
- Navigate through pages

### 5. Loading and Error States
- Loading spinner while fetching data
- Error handling with retry functionality
- Empty state when no users found

## Response Structure
```typescript
interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

## User Data Structure
```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: Array<{
    _id: string;
    name: string;
    category: string;
  }>;
  skillsWanted: Array<{
    _id: string;
    name: string;
    category: string;
  }>;
  availability: string;
  isPublic: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}
```

## Environment Configuration
The API base URL is configured in the `.env` file:
```
VITE_API_URL=https://48x9r4cv-3000.inc1.devtunnels.ms/api/v1
```

## Usage
1. Navigate to the ShowSkills page
2. Use the search bar to find users by name or skills
3. Use the availability dropdown to filter by availability
4. Use pagination to navigate through results
5. Click on user cards to view details (TODO: implement swap request)

## Future Enhancements
- Implement swap request functionality
- Add user rating system
- Add more advanced filtering options
- Implement real-time updates
- Add user profile photos 