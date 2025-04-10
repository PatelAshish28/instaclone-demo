import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append('caption', caption);
    if (file) formData.append('image', file);

    try {
      setLoading(true);
      const res = await axios.post(
        'https://instaclone-demo.onrender.com/api/v1/post/addpost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setFile(null);
        setImagePreview('');
        setCaption('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-lg w-full p-4 sm:p-6 flex flex-col gap-4"
      >
        <DialogHeader className="text-center font-semibold text-lg">
          Create New Post
        </DialogHeader>

        {/* User Info */}
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="User Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-500 text-xs">Bio here...</span>
          </div>
        </div>

        {/* Caption */}
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="focus-visible:ring-transparent resize-none border border-gray-300"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full h-64 overflow-hidden rounded-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* File Input (hidden) */}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={fileChangeHandler}
        />

        {/* Select Button */}
        <Button
          onClick={() => imageRef.current.click()}
          variant="outline"
          className="w-full"
        >
          Select from computer
        </Button>

        {/* Submit Button */}
        {imagePreview && (
          <Button
            onClick={createPostHandler}
            disabled={loading}
            className="w-full bg-[#0095F6] hover:bg-[#258bcf]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Please wait
              </>
            ) : (
              'Post'
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
