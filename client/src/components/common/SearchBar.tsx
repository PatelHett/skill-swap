import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, placeholder }) => (
  <div className="relative w-full max-w-xs">
    <input
      type="text"
      className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white placeholder-gray-400 transition"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || 'Search...'}
      onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
    />
    {/* Magnifying Glass Button */}
    <button
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      onClick={onSearch}
      aria-label="search"
      type="button"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
      </svg>
    </button>
  </div>
);

export default SearchBar; 