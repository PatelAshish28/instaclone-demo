import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className="flex-1 my-8 flex flex-col items-center px-4 md:px-8 lg:pl-[20%]">
      <Posts />
    </div>
  );
};

export default Feed;
