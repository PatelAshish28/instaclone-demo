import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(store => store.auth)

  return (
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm mb-4'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium text-xs text-[#3BADF8] hover:text-[#3495d6] cursor-pointer'>
          See All
        </span>
      </div>
      {
        suggestedUsers?.length > 0 ? suggestedUsers.map((user) => (
          <div key={user._id} className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3 overflow-hidden'>
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} alt={`${user?.username}'s avatar`} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div className='overflow-hidden'>
                <h1 className='font-semibold text-sm truncate'>
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className='text-gray-600 text-xs truncate block'>
                  {user?.bio || 'Bio here...'}
                </span>
              </div>
            </div>
            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6] whitespace-nowrap'>
              Follow
            </span>
          </div>
        )) : (
          <p className='text-sm text-gray-500 mt-4'>No suggestions available.</p>
        )
      }
    </div>
  )
}

export default SuggestedUsers
