import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState('posts');
  const { userProfile, user } = useSelector(store => store.auth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (userProfile) {
      setIsFollowing(userProfile.followers?.includes(user._id));
      setFollowersCount(userProfile.followers?.length || 0);
    }
  }, [userProfile, user]);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(`https://instaclone-demo.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`);
      if (res.status === 200) {
        setIsFollowing(prev => !prev);
        setFollowersCount(prev => (isFollowing ? prev - 1 : prev + 1));
      }
    } catch (err) {
      console.error('Follow/Unfollow error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start md:gap-12">
        <div className="flex justify-center md:w-1/3">
          <Avatar className="h-28 w-28 md:h-32 md:w-32">
            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xl font-semibold">{userProfile?.username}</span>
              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <Button variant="secondary" className="h-8">Edit profile</Button>
                  </Link>
                  <Button variant="secondary" className="h-8">View archive</Button>
                  <Button variant="secondary" className="h-8">Ad tools</Button>
                </>
              ) : (
                <Button
                  className={`h-8 ${isFollowing ? 'bg-gray-300 text-black' : 'bg-[#0095F6] text-white hover:bg-[#1878d4]'}`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <p><span className="font-semibold">{userProfile?.posts.length}</span> posts</p>
              <p><span className="font-semibold">{followersCount}</span> followers</p>
              <p><span className="font-semibold">{userProfile?.following.length}</span> following</p>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">{userProfile?.bio || 'bio here...'}</span>
              <Badge variant="secondary" className="w-fit flex items-center gap-1">
                <AtSign size={14} />
                <span>{userProfile?.username}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-t border-gray-200">
        <div className="flex justify-center gap-6 text-xs sm:text-sm font-medium py-3">
          <span className={`cursor-pointer ${activeTab === 'posts' ? 'text-black font-bold' : 'text-gray-500'}`} onClick={() => handleTabChange('posts')}>
            POSTS
          </span>
          <span className={`cursor-pointer ${activeTab === 'saved' ? 'text-black font-bold' : 'text-gray-500'}`} onClick={() => handleTabChange('saved')}>
            SAVED
          </span>
          <span className="text-gray-400 cursor-not-allowed">REELS</span>
          <span className="text-gray-400 cursor-not-allowed">TAGS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-2">
          {
            displayedPost?.map((post) => (
              <div key={post?._id} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  alt="post"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white gap-4">
                    <button className="flex items-center gap-1">
                      <Heart size={18} />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-1">
                      <MessageCircle size={18} />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Profile;
