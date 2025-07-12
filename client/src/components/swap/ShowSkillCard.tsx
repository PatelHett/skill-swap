import React from 'react';

interface ShowSkillCardProps {
  profilePhoto: string;
  name: string;
  rating: number;
  skillsOffered: string[];
  skillWanted?: string;
  onRequest?: () => void;
}

const ShowSkillCard: React.FC<ShowSkillCardProps> = ({
  profilePhoto,
  name,
  rating,
  skillsOffered,
  skillWanted,
  onRequest,
}) => (
  <div className="flex flex-col md:flex-row items-center border border-gray-200 rounded-2xl p-6 mb-8 bg-white shadow-lg transition-shadow hover:shadow-xl">
    {/* Profile Photo & Rating */}
    <div className="flex flex-col items-center md:items-start md:w-1/5 mb-4 md:mb-0">
      <img
        src={profilePhoto}
        alt="Profile"
        className="w-20 h-20 rounded-md shadow-md object-cover"
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
          {skillsOffered?.length > 0 ? (
            skillsOffered.map(skill => (
              <span key={skill} className="inline-block bg-[#E3F2FD] text-[#0A192F] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 border border-[#2196F3]">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">None</span>
          )}
        </div>
        {skillWanted && (
          <div className="flex items-center mt-1">
            <span className="text-sm font-medium text-gray-700">Skill Wanted:</span>
            <span className="inline-block bg-blue-50 text-[#2196F3] rounded-full px-3 py-1 text-sm font-semibold ml-2 border border-blue-200">
              {skillWanted}
            </span>
          </div>
        )}
      </div>
      {/* Request Button */}
      <div className="flex flex-col items-end md:ml-8 mt-4 md:mt-0 min-w-[120px]">
        <button
          className="px-5 py-1.5 rounded-full bg-blue-500 text-white font-medium text-sm shadow-sm border border-blue-600 hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          onClick={onRequest}
        >
          Request
        </button>
      </div>
    </div>
  </div>
);

export default ShowSkillCard; 