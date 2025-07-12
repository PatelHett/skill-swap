import React, { useState, useEffect } from 'react';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import SwapRequestCard from '../components/swap/SwapRequestCard';
import { getMockSwapRequests, getSwapRequest } from '../utils/api';
import type { SwapRequest } from '../utils/api';

const filterOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
];

const SwapRequestsPage: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Frontend filtering and search function
  const filterAndSearchRequests = (
    requests: SwapRequest[],
    searchTerm: string,
    statusFilter: string,
    page: number = 1,
    limit: number = 10
  ): { filteredRequests: SwapRequest[]; totalPages: number; total: number } => {
    let filtered = [...requests];

    // Filter by search term (requester or recipient username)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(request => {
        // Search in requester username
        if (request.requester?.username?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in recipient username
        if (request.recipient?.username?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        return false;
      });
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(request => 
        request.status === statusFilter
      );
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Apply pagination
    const paginatedRequests = filtered.slice(startIndex, endIndex);

    return {
      filteredRequests: paginatedRequests,
      totalPages,
      total
    };
  };

  const fetchSwapRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, use mock data. In production, you would fetch from API
      const mockData = getMockSwapRequests();
      setSwapRequests(mockData);
    } catch (err) {
      setError('Failed to fetch swap requests. Please try again.');
      console.error('Error fetching swap requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    if (swapRequests.length > 0) {
      const result = filterAndSearchRequests(swapRequests, search, filter, currentPage, 10);
      setFilteredRequests(result.filteredRequests);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    }
  };

  // Fetch swap requests on component mount
  useEffect(() => {
    fetchSwapRequests();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    if (swapRequests.length > 0) {
      applyFiltersAndSearch();
    }
  }, [swapRequests, search, filter, currentPage]);

  const handleAccept = (swapId: string) => {
    console.log('Accepting swap request:', swapId);
    // TODO: Implement accept functionality
  };

  const handleReject = (swapId: string) => {
    console.log('Rejecting swap request:', swapId);
    // TODO: Implement reject functionality
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6">
      {/* Filter, Search */}
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <FilterDropdown
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={() => {}}
            placeholder="Search by name..."
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading swap requests...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchSwapRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Requests List */}
      {!loading && !error && (
        <div>
          {filteredRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              {search || filter ? 'No swap requests found matching your criteria.' : 'No swap requests available.'}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredRequests.length} of {total} swap requests
              </div>
              {filteredRequests.map((swapRequest) => (
                <SwapRequestCard
                  key={swapRequest._id}
                  profilePhoto={swapRequest.requester?.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  name={swapRequest.requester?.username || 'Unknown User'}
                  rating={4.5} // TODO: Add rating system
                  skillsOffered={swapRequest.requester?.skillsOffered?.map(skill => skill.name) || []}
                  skillWanted={swapRequest.requester?.skillsWanted?.map(skill => skill.name).join(', ') || ''}
                  status={swapRequest.status as 'Pending' | 'Accepted' | 'Rejected'}
                  onAccept={() => handleAccept(swapRequest._id)}
                  onReject={() => handleReject(swapRequest._id)}
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
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default SwapRequestsPage; 