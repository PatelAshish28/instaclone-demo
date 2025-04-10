import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)

  return (
    <aside className='hidden lg:block w-full max-w-[300px] px-4 my-8'>
      <div className='flex items-center gap-4'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePicture} alt={`${user?.username}'s profile`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className='overflow-hidden'>
          <h1 className='font-semibold text-sm truncate'>
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <p className='text-gray-600 text-sm truncate'>{user?.bio || 'Bio here...'}</p>
        </div>
      </div>

      <div className='mt-6'>
        <SuggestedUsers />
      </div>
    </aside>
  )
}

export default RightSidebar
