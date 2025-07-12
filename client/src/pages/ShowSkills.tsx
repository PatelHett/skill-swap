import React, { useState, useEffect } from 'react';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ShowSkillCard from '../components/swap/ShowSkillCard';
import { getUsers } from '../utils/api';
import type { User } from '../utils/api';

const filterOptions = [
  { label: 'All Availability', value: '' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekends', value: 'weekends' },
  { label: 'Evenings', value: 'evenings' },
  { label: 'Custom', value: 'custom' },
];

const ShowSkills: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Frontend filtering and search function
  const filterAndSearchUsers = (
    users: User[],
    searchTerm: string,
    availabilityFilter: string,
    page: number = 1,
    limit: number = 10
  ): { filteredUsers: User[]; totalPages: number; total: number } => {
    let filtered = [...users];

    // Filter by search term (username or skills)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user => {
        // Search in username
        if (user.username.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in skills offered
        if (user?.skillsOffered?.some(skill => 
          skill.name.toLowerCase().includes(searchLower)
        )) {
          return true;
        }
        
        // Search in skills wanted
        if (user?.skillsWanted?.some(skill => 
          skill.name.toLowerCase().includes(searchLower)
        )) {
          return true;
        }
        
        return false;
      });
    }

    // Filter by availability
    if (availabilityFilter) {
      filtered = filtered.filter(user => 
        user.availability === availabilityFilter
      );
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Apply pagination
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    return {
      filteredUsers: paginatedUsers,
      totalPages,
      total
    };
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all users from backend (no filtering parameters)
      const response = await getUsers({ page: 1, limit: 20 }); // Get all users
      setAllUsers(response.users);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    if (allUsers.length > 0) {
      const result = filterAndSearchUsers(allUsers, search, filter, currentPage, 10);
      setFilteredUsers(result.filteredUsers);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    }
  };

  // Fetch all users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Apply filters and search when dependencies change
  useEffect(() => {
    if (allUsers.length > 0) {
      applyFiltersAndSearch();
    }
  }, [allUsers, search, filter, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6">
      {/* Filter, Search */}
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <FilterDropdown
            options={filterOptions}
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Search by name or skills..."
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAllUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users List */}
      {!loading && !error && (
        <div>
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              {search || filter ? 'No users found matching your criteria.' : 'No users available.'}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredUsers.length} of {total} users
              </div>
              {filteredUsers.map((user: User) => (
                <ShowSkillCard
                  key={user._id}
                  profilePhoto={user.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  name={user.username}
                  rating={4.5} // TODO: Add rating system
                  skillsOffered={user?.skillsOffered?.map((skill: any) => skill.name)}
                  skillWanted={user?.skillsWanted?.map((skill: any) => skill.name).join(', ')}
                  onRequest={() => {
                    // TODO: Implement swap request functionality
                    console.log('Request swap with:', user.username);
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ShowSkills; 