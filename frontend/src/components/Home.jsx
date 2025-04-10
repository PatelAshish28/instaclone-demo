import React from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex flex-col lg:flex-row">
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
