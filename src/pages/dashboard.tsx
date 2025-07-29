'use client';

import { useTheme } from '@/components/ThemeProvider'; // Correct import
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme(); // Access theme context from ThemeProvider
  const router = useRouter();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Simulating fetching user data
    const fetchUserData = async () => {
      // Placeholder for fetching user data logic
      setUserData({
        name: 'John Doe',
        email: 'john.doe@example.com',
        level: 'Advanced',
      });
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Simulating a logout
    router.push('/login');
  };

  return (
    <div className={`min-h-screen bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
        {userData && (
          <div className="mb-6">
            <h2 className="text-xl">Name: {userData.name}</h2>
            <p>Email: {userData.email}</p>
            <p>Level: {userData.level}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Toggle Theme
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
