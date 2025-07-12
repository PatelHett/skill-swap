// src/components/SkillsSelector.tsx
import React, { useState } from 'react';
import { FiX, FiPlus, FiSearch } from 'react-icons/fi';

interface Skill {
  _id: string;
  skillId: string;
  name: string;
  category: string;
  description?: string;
}

interface SkillsSelectorProps {
  label: string;
  skills: Skill[];
  selectedSkillIds: string[];
  excludeSkillIds: string[]; // Skills already selected in the other category
  onSkillsChange: (skillIds: string[]) => void;
  isEditing: boolean;
  color: 'blue' | 'green';
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({
  label,
  skills,
  selectedSkillIds,
  excludeSkillIds,
  onSkillsChange,
  isEditing,
  color,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const colorClasses = {
    blue: {
      tag: 'bg-blue-50 text-[#2196F3] border-blue-200',
      tagHover: 'hover:bg-blue-100',
      button: 'bg-[#2196F3] hover:bg-blue-600',
      focus: 'focus:ring-[#2196F3]',
    },
    green: {
      tag: 'bg-green-50 text-green-700 border-green-200',
      tagHover: 'hover:bg-green-100',
      button: 'bg-green-600 hover:bg-green-700',
      focus: 'focus:ring-green-500',
    },
  };

  const classes = colorClasses[color];

  // Filter available skills (exclude already selected and skills from other category)
  const availableSkills = skills.filter(skill => 
    !selectedSkillIds.includes(skill._id) && 
    !excludeSkillIds.includes(skill._id) &&
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected skills details
  const selectedSkills = skills.filter(skill => selectedSkillIds.includes(skill._id));

  const addSkill = (skillId: string) => {
    onSkillsChange([...selectedSkillIds, skillId]);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(selectedSkillIds.filter(id => id !== skillId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-lg font-semibold text-[#0A192F]">{label}</label>
        <span className={`${classes.button} text-white text-xs px-2 py-1 rounded-full`}>
          {selectedSkills.length} skills
        </span>
      </div>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSkills.length > 0 ? (
          selectedSkills.map((skill) => (
            <div
              key={skill._id}
              className={`inline-flex items-center px-3 py-2 ${classes.tag} rounded-lg text-sm font-medium border transition-colors ${classes.tagHover}`}
            >
              <span>{skill.name}</span>
              {isEditing && (
                <button
                  onClick={() => removeSkill(skill._id)}
                  className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity"
                >
                  <FiX className="h-3 w-3" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No skills selected</p>
        )}
      </div>

      {/* Add Skills Dropdown */}
      {isEditing && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-center px-4 py-2 ${classes.button} text-white rounded-lg transition-colors`}
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Skill
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg ${classes.focus} focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="Search skills..."
                  />
                </div>
              </div>

              {/* Skills List */}
              <div className="max-h-48 overflow-y-auto">
                {availableSkills.length > 0 ? (
                  availableSkills.map((skill) => (
                    <button
                      key={skill._id}
                      onClick={() => addSkill(skill._id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{skill.name}</p>
                          <p className="text-sm text-gray-500">{skill.category}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-gray-500 text-center">
                    {searchTerm ? 'No skills found' : 'No more skills available'}
                  </p>
                )}
              </div>

              {/* Close button */}
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsSelector;