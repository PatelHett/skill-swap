import React from 'react';

interface SwapRequestCardProps {
  profilePhoto: string;
  name: string;
  rating: number;
  skillsOffered: string[];
  skillWanted: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  isAdmin?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

const statusStyles = {
  Pending: 'bg-blue-100 text-blue-700 border-blue-200',
  Accepted: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-600 border-red-200',
};

const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
  profilePhoto,
  name,
  rating,
  skillsOffered,
  skillWanted,
  isAdmin,
  status,
  onAccept,
  onReject,
}) => (
  <div className="flex flex-col md:flex-row items-center border border-gray-200 rounded-2xl p-6 mb-8 bg-white shadow-lg transition-shadow hover:shadow-xl">
    {/* Profile Photo & Rating */}
    <div className="flex flex-col items-center md:items-start md:w-1/5 mb-4 md:mb-0">
      <img
        src={profilePhoto}
        alt="Profile"
        className="w-20 h-20 rounded-md  shadow-md object-cover"
      />
      <span className="mt-2 text-xs text-gray-500">Rating <b>{rating}/5</b></span>
    </div>
    {/* Main Info */}
    <div className="flex-1 w-full md:w-auto md:ml-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <span className="text-xl font-bold text-[#0A192F] mb-2 md:mb-0">{name}</span>
        </div>
        <div className="flex flex-wrap items-center mt-2 space-x-2">
          <span className="text-gray-700 text-sm font-medium">Skills Offered:</span>
          {skillsOffered.length > 0 ? (
            skillsOffered.map(skill => (
              <span key={skill} className="inline-block bg-[#E3F2FD] text-[#0A192F] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 border border-[#2196F3]">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">None</span>
          )}
        </div>
        <div className="flex items-center mt-1">
          <span className=" text-sm font-medium text-gray-700">Skill Wanted:</span>
          {skillWanted ? (
            <span className="inline-block bg-blue-50 text-[#2196F3] rounded-full px-3 py-1 text-sm font-semibold ml-2 border border-blue-200">
              {skillWanted}
            </span>
          ) : (
            <span className="text-gray-400 text-sm ml-2">None</span>
          )}
        </div>
      </div>
      {/* Status and Action Buttons */}
      <div className="flex flex-col items-end md:ml-8 mt-4 md:mt-0 min-w-[120px]">
        <span
          className={`inline-block px-4 py-1 mb-2 rounded-full border text-sm font-semibold ${statusStyles[status]}`}
        >
          {status}
        </span>
        {status === 'Pending' && !isAdmin && (
          <div className="flex md:flex-col flex-row gap-2 w-full md:w-auto">
            <button
              className="px-4 py-1 rounded-full bg-green-50 text-green-700 border border-green-300 text-sm font-medium shadow-sm hover:bg-green-100 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
              onClick={onAccept}
            >
              Accept
            </button>
            <button
              className="px-4 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-sm font-medium shadow-sm hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-100 transition"
              onClick={onReject}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SwapRequestCard; 