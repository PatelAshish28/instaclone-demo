import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post)

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 max-w-2xl mx-auto mt-6">
      {posts && posts.length > 0 ? (
        posts.map(post => <Post key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500 text-sm mt-10">No posts available.</p>
      )}
    </div>
  )
}

export default Posts
