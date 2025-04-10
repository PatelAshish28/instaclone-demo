import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const [liked, setLiked] = useState(post.likes.includes(user?._id))
  const [postLike, setPostLike] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    setText(inputText.trim() ? inputText : "")
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like'
      const res = await axios.get(`https://instaclone-demo.onrender.com/api/v1/post/${post._id}/${action}`, {
        withCredentials: true
      })
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1
        setPostLike(updatedLikes)
        setLiked(!liked)

        const updatedPostData = posts.map(p =>
          p._id === post._id
            ? {
                ...p,
                likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
              }
            : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instaclone-demo.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        )

        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://instaclone-demo.onrender.com/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      )
      if (res.data.success) {
        const updatedPostData = posts.filter(p => p?._id !== post?._id)
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post")
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://instaclone-demo.onrender.com/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='my-8 w-full max-w-md mx-auto px-2 sm:px-0'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-2'>
            <h1 className='text-sm font-medium'>{post.author?.username}</h1>
            {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button variant='ghost' className="text-red-500 font-bold">Unfollow</Button>
            )}
            <Button variant='ghost'>Add to favorites</Button>
            {user && user?._id === post?.author._id && (
              <Button onClick={deletePostHandler} variant='ghost'>Delete</Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Image */}
      <img
        className='rounded-md my-3 w-full aspect-square object-cover'
        src={post.image}
        alt="post_img"
      />

      {/* Icons */}
      <div className='flex items-center justify-between my-2'>
        <div className='flex items-center gap-4'>
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className='cursor-pointer text-red-600'
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className='cursor-pointer hover:text-gray-600'
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post))
              setOpen(true)
            }}
            className='cursor-pointer hover:text-gray-600'
          />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
      </div>

      {/* Likes */}
      <span className='font-semibold text-sm mb-1 block'>{postLike} likes</span>

      {/* Caption */}
      <p className='text-sm mb-1'>
        <span className='font-medium mr-2'>{post.author?.username}</span>
        {post.caption}
      </p>

      {/* View Comments */}
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }}
          className='text-sm text-gray-500 cursor-pointer'
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className='flex items-center gap-2 mt-2'>
        <input
          type="text"
          placeholder='Add a comment...'
          value={text}
          onChange={changeEventHandler}
          className='flex-1 outline-none text-sm bg-transparent border-b border-gray-300 pb-1'
        />
        {text && (
          <span onClick={commentHandler} className='text-blue-500 text-sm font-medium cursor-pointer'>
            Post
          </span>
        )}
      </div>
    </div>
  )
}

export default Post
