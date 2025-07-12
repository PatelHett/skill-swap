// src/pages/Profile.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { updateProfile, setUser } from '../store/authSlice';
import { fetchAllSkills } from '../store/skillsSlice';
import { api } from '../utils/api';
import { toast } from 'react-hot-toast';
import { 
  FiCamera, 
  FiX, 
  FiEdit2, 
  FiSave, 
  FiUser, 
  FiEye, 
  FiEyeOff,
  FiClock,
  FiMapPin
} from 'react-icons/fi';
import SkillsSelector from '../components/SkillsSelector';

const Profile: React.FC = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const { skills, isLoading: skillsLoading } = useAppSelector((state) => state.skills);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: user?.username || '',
    location: user?.location || '',
    availability: user?.availability || 'weekends',
  });

  // Profile visibility state - completely separate from editing
  const [isPublic, setIsPublic] = useState<boolean>(user?.isPublic ?? true);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  // Skills states
  const [skillsOffered, setSkillsOffered] = useState<string[]>(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState<string[]>(user?.skillsWanted || []);

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');

  // Fetch skills on component mount
  useEffect(() => {
    if (skills.length === 0) {
      dispatch(fetchAllSkills());
    }
  }, [dispatch, skills.length]);

  // Update state when user data changes - but be careful with isPublic
  useEffect(() => {
    if (user) {
      setEditedData({
        username: user.username,
        location: user.location || '',
        availability: user.availability,
      });
      setSkillsOffered(user.skillsOffered || []);
      setSkillsWanted(user.skillsWanted || []);
      setProfilePhoto(user.profilePhoto || '');
      
      // Only update isPublic if it's actually different and we're not currently toggling
      if (!isTogglingVisibility && user.isPublic !== isPublic) {
        setIsPublic(user.isPublic);
      }
    }
  }, [user?.username, user?.location, user?.availability, user?.skillsOffered, user?.skillsWanted, user?.profilePhoto]);

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

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const response = await api.post('/auth/toggle-profile-visibility');
      const newVisibility = response.data.isPublic;
      
      // Update local state immediately
      setIsPublic(newVisibility);
      
      // Update the user in Redux state without triggering a full profile update
      if (user) {
        const updatedUser = {
          ...user,
          isPublic: newVisibility
        };
        dispatch(setUser(updatedUser));
      }
      
      toast.success(`Profile is now ${newVisibility ? 'public' : 'private'}`);
    } catch (error: any) {
      // Revert local state on error
      setIsPublic(!isPublic);
      toast.error('Failed to update profile visibility');
      console.error('Toggle visibility error:', error);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleDiscard = () => {
    setEditedData({
      username: user?.username || '',
      location: user?.location || '',
      availability: user?.availability || 'weekends',
    });
    setSkillsOffered(user?.skillsOffered || []);
    setSkillsWanted(user?.skillsWanted || []);
    setProfilePhoto(user?.profilePhoto || '');
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePhoto(url);
      setIsEditing(true);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhoto('');
    setIsEditing(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const handleSkillsOfferedChange = (skillIds: string[]) => {
    setSkillsOffered(skillIds);
    setIsEditing(true);
  };

  const handleSkillsWantedChange = (skillIds: string[]) => {
    setSkillsWanted(skillIds);
    setIsEditing(true);
  };

  const getUserInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (skillsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2196F3] mx-auto"></div>
          <p className="mt-4 text-[#333333]">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0A192F]">Profile Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account and skill preferences</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isEditing && (
                <>
                  <button
                    onClick={handleDiscard}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196F3] transition-colors"
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-[#2196F3] text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196F3] disabled:opacity-50 transition-colors"
                  >
                    <FiSave className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 bg-[#0A192F] text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A192F] transition-colors"
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#2196F3] to-blue-600 px-6 py-8 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30 backdrop-blur-sm">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {getUserInitial()}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <FiCamera className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mt-4">{user?.username}</h2>
                <p className="text-blue-100 text-sm">{user?.email}</p>
                {user?.location && (
                  <p className="text-blue-100 text-xs mt-1">
                    <FiMapPin className="inline mr-1" />
                    {user.location}
                  </p>
                )}
                <div className="mt-2 inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs text-blue-100">
                  <span className={`w-2 h-2 rounded-full mr-2 ${user?.role === 'admin' ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                  {user?.role === 'admin' ? 'Administrator' : 'Member'}
                </div>
                
                {/* Visibility Toggle */}
                <div className="mt-6 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isPublic ? (
                        <FiEye className="h-4 w-4 text-white mr-2" />
                      ) : (
                        <FiEyeOff className="h-4 w-4 text-white mr-2" />
                      )}
                      <span className="text-white text-sm font-medium">
                        {isPublic ? 'Public Profile' : 'Private Profile'}
                      </span>
                    </div>
                    <button
                      onClick={handleToggleVisibility}
                      disabled={isTogglingVisibility}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                        isPublic ? 'bg-green-500' : 'bg-gray-600'
                      } ${isTogglingVisibility ? 'opacity-50' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isPublic ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-blue-100 mt-2">
                    {isPublic 
                      ? 'Your profile is visible to everyone' 
                      : 'Your profile is only visible to you'
                    }
                  </p>
                </div>
              </div>

              {/* File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Photo Actions */}
              {isEditing && profilePhoto && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={removeProfilePhoto}
                    className="w-full flex items-center justify-center px-3 py-2 text-red-600 text-sm hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    Remove Photo
                  </button>
                </div>
              )}

              {/* Account Info */}
              <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                <div className="text-sm">
                  <span className="text-gray-500">Member since:</span>
                  <p className="font-medium text-gray-900">{formatDate(user?.createdAt || '')}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Last updated:</span>
                  <p className="font-medium text-gray-900">{formatDate(user?.updatedAt || '')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <FiUser className="h-5 w-5 text-[#2196F3] mr-2" />
                <h3 className="text-lg font-semibold text-[#0A192F]">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editedData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={editedData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter your location"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiClock className="inline mr-1" />
                    Availability
                  </label>
                  <select
                    value={editedData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <option value="weekends">Weekends</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="evenings">Evenings</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills Offered */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <SkillsSelector
                label="Skills I Can Offer"
                skills={skills}
                selectedSkillIds={skillsOffered}
                excludeSkillIds={skillsWanted}
                onSkillsChange={handleSkillsOfferedChange}
                isEditing={isEditing}
                color="blue"
              />
            </div>

            {/* Skills Wanted */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <SkillsSelector
                label="Skills I Want to Learn"
                skills={skills}
                selectedSkillIds={skillsWanted}
                excludeSkillIds={skillsOffered}
                onSkillsChange={handleSkillsWantedChange}
                isEditing={isEditing}
                color="green"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;