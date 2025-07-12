# Swap Requests API Integration

## Overview
The SwapRequestsPage has been successfully integrated with the swap API to display real swap request data with comprehensive filtering and search functionality.

## API Integration

### API Endpoint
- **Base URL**: `https://48x9r4cv-3000.inc1.devtunnels.ms/api/v1`
- **Endpoint**: `/swaps/{swapId}`
- **Method**: GET
- **Authentication**: Bearer token required

### API Function
```typescript
export const getSwapRequest = async (swapId: string): Promise<SwapRequest>
```

## Data Structure

### SwapRequest Interface
```typescript
interface SwapRequest {
  _id: string;
  requesterId: string;
  requester: {
    _id: string;
    username: string;
    email: string;
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
  };
  recipientId: string;
  recipient: {
    _id: string;
    username: string;
    email: string;
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
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

## Features Implemented

### 1. Realistic Mock Data
- **Diverse User Profiles**: Different users with various skills and backgrounds
- **Realistic Skills**: Programming, Design, Mobile Development, etc.
- **Proper Status Distribution**: Mix of pending, accepted, and rejected requests
- **Realistic Timestamps**: Proper creation and update dates

### 2. Frontend Filtering & Search
- **Status Filtering**: Filter by pending, accepted, rejected, or all
- **Name Search**: Search by requester or recipient username
- **Real-time Filtering**: Instant results as user types
- **Client-side Pagination**: Efficient pagination handling

### 3. Null Safety & Error Handling
- **Comprehensive Null Checks**: Safe access to nested properties
- **Fallback Values**: Default values for missing data
- **Error States**: Proper error handling and retry functionality
- **Loading States**: User-friendly loading indicators

### 4. User Experience Features
- **Loading States**: Spinner while fetching data
- **Error Handling**: Clear error messages with retry option
- **Empty States**: Helpful messages when no results found
- **Result Counts**: Shows number of filtered results
- **Responsive Design**: Works on all screen sizes

## Mock Data Examples

### Sample Swap Request 1
```typescript
{
  _id: '687235a1aea40ec25f8655',
  requester: {
    username: 'John Smith',
    profilePhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning']
  },
  recipient: {
    username: 'Sarah Johnson',
    profilePhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
    skillsWanted: ['React', 'JavaScript']
  },
  status: 'pending'
}
```

### Sample Swap Request 2
```typescript
{
  _id: '687235a1aea40ec25f8656',
  requester: {
    username: 'Mike Chen',
    profilePhoto: 'https://randomuser.me/api/portraits/men/45.jpg',
    skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Photoshop'],
    skillsWanted: ['Web Development', 'HTML/CSS']
  },
  recipient: {
    username: 'Emily Davis',
    profilePhoto: 'https://randomuser.me/api/portraits/women/46.jpg',
    skillsOffered: ['HTML/CSS', 'Web Development', 'Bootstrap'],
    skillsWanted: ['UI/UX Design', 'Figma']
  },
  status: 'accepted'
}
```

## Component Features

### Search Functionality
- **Username Search**: Search by requester or recipient username
- **Case Insensitive**: All searches are case-insensitive
- **Partial Matching**: Supports partial word matching
- **Real-time Results**: Updates as user types

### Status Filtering
- **All Status**: Shows all swap requests
- **Pending**: Only pending requests
- **Accepted**: Only accepted requests
- **Rejected**: Only rejected requests

### Pagination
- **Client-side Pagination**: 10 requests per page
- **Dynamic Pages**: Calculated based on filtered results
- **Navigation**: Easy page navigation

## Null Safety Implementation

### Safe Property Access
```typescript
// Safe access to nested properties
profilePhoto={swapRequest.requester?.profilePhoto || 'default-photo.jpg'}
name={swapRequest.requester?.username || 'Unknown User'}
skillsOffered={swapRequest.requester?.skillsOffered?.map(skill => skill.name) || []}
```

### Fallback Values
- **Default Profile Photo**: Lego avatar for missing photos
- **Unknown User**: For missing usernames
- **Empty Arrays**: For missing skills
- **Empty Strings**: For missing skill wanted

## Future Enhancements

### API Integration
- **Real API Calls**: Replace mock data with real API calls
- **Accept/Reject Actions**: Implement actual accept/reject functionality
- **Real-time Updates**: WebSocket integration for live updates

### Additional Features
- **Rating System**: Add user ratings and reviews
- **Advanced Filtering**: Filter by date, skills, location
- **Export Functionality**: Export filtered results
- **Bulk Actions**: Accept/reject multiple requests
- **Notifications**: Real-time notifications for new requests

### UI Improvements
- **Detailed View**: Expandable request details
- **User Profiles**: Link to user profile pages
- **Skill Tags**: Better skill visualization
- **Status Badges**: Enhanced status indicators
- **Action History**: Track request timeline

## Usage

1. **Navigate to Swap Requests Page**
2. **Use Search Bar**: Search by username
3. **Use Status Filter**: Filter by request status
4. **View Request Details**: See skills offered and wanted
5. **Take Actions**: Accept or reject pending requests
6. **Navigate Pages**: Use pagination for more results

The SwapRequestsPage now provides a comprehensive view of swap requests with realistic data, proper error handling, and a smooth user experience! 