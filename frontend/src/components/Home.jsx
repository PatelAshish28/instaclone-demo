import React from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import DarkModeToggle from './DarkModeToggle'; // 👈 Import the dark mode toggle

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-black text-black dark:text-white min-h-screen transition-all">
      <DarkModeToggle /> {/* 👈 Add toggle button here */}
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
