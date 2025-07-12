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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: {
        page?: number;
        limit?: number;
        search?: string;
        availability?: string;
      } = {
        page: currentPage,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (filter) {
        params.availability = filter;
      }

      const response = await getUsers(params);
      console.log('response', response)
      setUsers(response?.users);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filter]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

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
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users List */}
      {!loading && !error && (
        <div>
          {users.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              {search || filter ? 'No users found matching your criteria.' : 'No users available.'}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {users.length} of {total} users
              </div>
              {users.map((user) => (
                <ShowSkillCard
                  key={user._id}
                  profilePhoto={user.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  name={user.username}
                  rating={4.5} // TODO: Add rating system
                  skillsOffered={user?.skillsOffered?.map(skill => skill.name)}
                  skillWanted={user?.skillsWanted?.map(skill => skill.name).join(', ')}
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