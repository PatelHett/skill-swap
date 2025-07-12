import React, { useState } from 'react';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ShowSkillCard from '../components/swap/ShowSkillCard';

const mockSkills = [
  {
    profilePhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Jane Doe',
    rating: 4.5,
    skillsOffered: ['React', 'Node.js'],
    skillWanted: 'UI/UX Design',
  },
  {
    profilePhoto: 'https://randomuser.me/api/portraits/men/45.jpg',
    name: 'John Smith',
    rating: 4.2,
    skillsOffered: ['Python', 'Django'],
    skillWanted: '',
  },
];

const filterOptions = [
  { label: 'Availability', value: '' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekends', value: 'weekends' },
  { label: 'Weekdays and Weekends', value: 'weekdays_weekends' },
];

const ShowSkills: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  // Filter and search logic (mocked)
  const filteredSkills = mockSkills.filter(skill =>
    (filter === '' || skill.skillsOffered.some(s => s.toLowerCase().includes(filter))) &&
    (search === '' || skill.name.toLowerCase().includes(search.toLowerCase()))
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
      {/* Skills List */}
      <div>
        {filteredSkills.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No skills found.</div>
        ) : (
          filteredSkills.map((skill, idx) => (
            <ShowSkillCard
              key={idx}
              profilePhoto={skill.profilePhoto}
              name={skill.name}
              rating={skill.rating}
              skillsOffered={skill.skillsOffered}
              skillWanted={skill.skillWanted}
              onRequest={() => {}}
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

export default ShowSkills; 