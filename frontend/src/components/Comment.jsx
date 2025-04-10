import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className='my-2'>
      <div className='flex items-start gap-3'>
        <Avatar className='w-8 h-8'>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='text-sm leading-snug'>
          <span className='font-semibold'>{comment?.author?.username}</span>{' '}
          <span className='font-normal break-words'>{comment?.text}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
