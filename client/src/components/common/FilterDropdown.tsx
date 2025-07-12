import React, { useState, useRef, useEffect } from 'react';

interface FilterDropdownProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full max-w-xs" ref={ref}>
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <button
        type="button"
        className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Filter Icon */}
        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.586V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.414a2 2 0 00-.586-1.414L2 6.707A1 1 0 012 6V4z" />
        </svg>
        <span className="flex-1 text-left text-sm text-gray-800 font-medium">
          {selected ? selected.label : 'Select'}
        </span>
        {/* Chevron Down */}
        <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto animate-fade-in"
          tabIndex={-1}
          role="listbox"
        >
          {options.map(opt => (
            <li
              key={opt.value}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${opt.value === value ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-800'}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDropdown; 