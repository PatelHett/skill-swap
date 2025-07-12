// src/pages/Profile.tsx
import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { updateProfile } from '../store/authSlice';
import { toast } from 'react-hot-toast';
import { FiCamera, FiX, FiEdit2, FiSave, FiMapPin, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const Profile: React.FC = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: user?.username || '',
    // location: user?.location || '',
    availability: user?.availability || 'weekends',
    isPublic: user?.isPublic || true,
  });

  // Skills states
  const [skillsOffered, setSkillsOffered] = useState<string[]>(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState<string[]>(user?.skillsWanted || []);
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');

  const handleSave = async () => {
    try {
      const updateData = {
        ...editedData,
        skillsOffered,
        skillsWanted,
        profilePhoto,
      };

      await dispatch(updateProfile(updateData)).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleDiscard = () => {
    setEditedData({
      username: user?.username || '',
    //   location: user?.location || '',
      availability: user?.availability || 'weekends',
      isPublic: user?.isPublic || true,
    });
    setSkillsOffered(user?.skillsOffered || []);
    setSkillsWanted(user?.skillsWanted || []);
    setProfilePhoto(user?.profilePhoto || '');
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      // For now, we'll use a local URL
      const url = URL.createObjectURL(file);
      setProfilePhoto(url);
      setIsEditing(true);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhoto('');
    setIsEditing(true);
  };

  const addSkillOffered = () => {
    if (newOfferedSkill.trim() && !skillsOffered.includes(newOfferedSkill.trim())) {
      setSkillsOffered([...skillsOffered, newOfferedSkill.trim()]);
      setNewOfferedSkill('');
      setIsEditing(true);
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
    setIsEditing(true);
  };

  const addSkillWanted = () => {
    if (newWantedSkill.trim() && !skillsWanted.includes(newWantedSkill.trim())) {
      setSkillsWanted([...skillsWanted, newWantedSkill.trim()]);
      setNewWantedSkill('');
      setIsEditing(true);
    }
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
    setIsEditing(true);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const getUserInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header with Save/Discard buttons */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#0A192F] px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
              <div className="flex space-x-3">
                {isEditing && (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                    >
                      <FiSave className="mr-2 h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={handleDiscard}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <FiX className="mr-2 h-4 w-4" />
                      Discard
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 bg-[#2196F3] text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196F3] transition-colors"
                >
                  <FiEdit2 className="mr-2 h-4 w-4" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-lg font-semibold text-[#0A192F] mb-2">
                    <FiUser className="inline mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={editedData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-lg font-semibold text-[#0A192F] mb-2">
                    <FiMapPin className="inline mr-2" />
                    Location
                  </label>
                  {/* <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
                    placeholder="Enter your location"
                  /> */}
                </div>

                {/* Skills Offered */}
                <div>
                  <label className="block text-lg font-semibold text-[#0A192F] mb-3">
                    Skills Offered
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skillsOffered.map((skill, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-[#2196F3] text-white rounded-full text-sm"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkillOffered(skill)}
                            className="ml-2 text-white hover:text-gray-200"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOfferedSkill}
                        onChange={(e) => setNewOfferedSkill(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                        placeholder="Add a skill you can offer"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                      />
                      <button
                        onClick={addSkillOffered}
                        className="px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-lg font-semibold text-[#0A192F] mb-2">
                    Availability
                  </label>
                  <select
                    value={editedData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
                  >
                    <option value="weekends">Weekends</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="evenings">Evenings</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Profile Visibility */}
                <div>
                  <label className="block text-lg font-semibold text-[#0A192F] mb-3">
                    Profile Visibility
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleInputChange('isPublic', true)}
                      disabled={!isEditing}
                      className={`flex items-center px-4 py-2 rounded-lg border ${
                        editedData.isPublic
                          ? 'bg-[#2196F3] text-white border-[#2196F3]'
                          : 'bg-white text-gray-700 border-gray-300'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'} transition-colors`}
                    >
                      <FiEye className="mr-2 h-4 w-4" />
                      Public
                    </button>
                    <button
                      onClick={() => handleInputChange('isPublic', false)}
                      disabled={!isEditing}
                      className={`flex items-center px-4 py-2 rounded-lg border ${
                        !editedData.isPublic
                          ? 'bg-gray-600 text-white border-gray-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'} transition-colors`}
                    >
                      <FiEyeOff className="mr-2 h-4 w-4" />
                      Private
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Photo & Skills Wanted */}
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="text-center">
                  <label className="block text-lg font-semibold text-[#0A192F] mb-4">
                    Profile Photo
                  </label>
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-gray-500">
                          {getUserInitial()}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="mt-4 space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center justify-center w-full px-3 py-2 bg-[#2196F3] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FiCamera className="mr-2 h-4 w-4" />
                          {profilePhoto ? 'Change' : 'Add'}
                        </button>
                        {profilePhoto && (
                          <button
                            onClick={removeProfilePhoto}
                            className="flex items-center justify-center w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <FiX className="mr-2 h-4 w-4" />
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <label className="block text-lg font-semibold text-[#0A192F] mb-3">
                    Skills Wanted
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skillsWanted.map((skill, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-sm"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkillWanted(skill)}
                            className="ml-2 text-white hover:text-gray-200"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newWantedSkill}
                        onChange={(e) => setNewWantedSkill(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                        placeholder="Add a skill you want to learn"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                      />
                      <button
                        onClick={addSkillWanted}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Add Skill
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;