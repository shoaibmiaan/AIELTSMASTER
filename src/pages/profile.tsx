'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/components/ThemeProvider';

const ProfilePage = () => {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    level: '',
    subject: '',
    current_band: '',
    target_band: 6.5,
    weaknesses: [],
    year_of_education: '',
    language_preference: 'en',
  });
  const [loadingState, setLoadingState] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Fetch user profile data
  useEffect(() => {
    if (user && !authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      if (!user || !user.id) {
        console.error('User not found or invalid user ID');
        return;
      }

      console.log('Fetching profile for user ID:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        setLoadingState(false);
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || user.email || '',
        country: data.country || '',
        level: data.level || '',
        subject: data.subject || '',
        current_band: data.current_band || '',
        target_band: data.target_band || 6.5,
        weaknesses: data.weaknesses || [],
        year_of_education: data.year_of_education || '',
        language_preference: data.language_preference || 'en',
      });
      setPreviewUrl(data.avatar_url || '');
      setLoadingState(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      setLoadingState(false);
    }
  };

  // Handle avatar file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  // Handle form data change (name, email, etc.)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
  };

  // Handle save profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingState(true);

      if (!user) throw new Error('User not authenticated');

      let avatarUrl = profile?.avatar_url || '';

      // Handle avatar upload if a new file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = urlData.publicUrl;
      }

      const updates = {
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      fetchProfile();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Update failed: ' + error.message);
    } finally {
      setLoadingState(false);
    }
  };

  // Loading states
  if (authLoading || loadingState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Authentication Required</h2>
          <p>Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-${theme === 'dark' ? 'gray-900' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden rounded-xl shadow-lg dark:bg-gray-800">
          <div className={`bg-gradient-to-r ${theme === 'dark' ? 'from-gray-700 to-gray-900' : 'from-blue-500 to-indigo-600'} p-6 md:p-8`}>
            <div className="flex flex-col items-center md:flex-row">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200 dark:border-gray-800 md:h-32 md:w-32">
                  <img
                    src={previewUrl || '/default-avatar.png'}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128';
                    }}
                  />
                </div>
                <label className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white p-2 shadow-md dark:bg-gray-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700 dark:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold md:text-3xl">{profile?.full_name || 'Your Name'}</h1>
                <p className="mt-1">{profile?.email || user.email}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="rounded-full px-3 py-1 text-sm bg-green-400 text-white">{profile?.role || 'student'}</span>
                  <span className="rounded-full px-3 py-1 text-sm bg-blue-400 text-white">{profile?.status || 'active'}</span>
                  <span className="rounded-full px-3 py-1 text-sm bg-purple-400 text-white">
                    Streak: {profile?.current_streak || 0} days
                  </span>
                </div>
              </div>

              <div className="mt-4 md:ml-auto md:mt-0">
                <button
                  onClick={logout}
                  className="flex items-center text-white hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Personal Information</h2>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Add form fields for user details */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-3 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingState}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingState ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
