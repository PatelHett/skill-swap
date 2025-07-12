import React, { useState } from 'react';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import SwapRequestCard from '../components/swap/SwapRequestCard';

const mockRequests = [
  {
    profilePhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Marc Demo',
    rating: 3.9,
    skillsOffered: ['Java Script'],
    skillWanted: 'PhotoShop',
    status: 'Pending',
  },
  {
    profilePhoto: 'https://randomuser.me/api/portraits/men/33.jpg',
    name: 'name',
    rating: 3.9,
    skillsOffered: [],
    skillWanted: '',
    status: 'Rejected',
  },
];

const filterOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Rejected', value: 'Rejected' },
];

const SwapRequestsPage: React.FC = () => {
  const [filter, setFilter] = useState('Pending');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // Filter and search logic (mocked)
  const filteredRequests = mockRequests.filter(req =>
    (filter === '' || req.status === filter) &&
    (search === '' || req.name.toLowerCase().includes(search.toLowerCase()))
  );

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
      {/* Requests List */}
      <div>
        {filteredRequests.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No requests found.</div>
        ) : (
          filteredRequests.map((req, idx) => (
            <SwapRequestCard
              key={idx}
              profilePhoto={req.profilePhoto}
              name={req.name}
              rating={req.rating}
              skillsOffered={req.skillsOffered}
              skillWanted={req.skillWanted}
              status={req.status as any}
              onAccept={() => {}}
              onReject={() => {}}
            />
          ))
        )}
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SwapRequestsPage; 