import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        className="px-2 py-1 text-lg disabled:text-gray-400"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous"
      >
        {'<'}
      </button>
      {pages.map(page => (
        <button
          key={page}
          className={`px-2 py-1 text-lg rounded ${page === currentPage ? 'font-bold text-blue-600' : 'text-gray-700'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="px-2 py-1 text-lg disabled:text-gray-400"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next"
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination; 