import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import SearchBar from './SearchBar';
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import {
  Home, Search, TrendingUp, MessageCircle, Heart, PlusSquare, LogOut, Menu
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://instaclone-demo.onrender.com/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') logoutHandler();
    else if (textType === "Create") setOpen(true);
    else if (textType === "Profile") navigate(`/profile/${user?._id}`);
    else if (textType === "Home") navigate("/");
    else if (textType === 'Messages') navigate("/chat");
     else if (textType === 'Search') setSearchModalOpen(true);
    else toast.info("Coming soon!");
    setMenuOpen(false); // Close mobile menu after action
  }

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className='w-6 h-6'>
          <AvatarImage src={user?.profilePicture} alt="@user" />
          <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },
  ]

  const SidebarContent = () => (
    <div className='flex flex-col'>
      <h1 className='my-8 pl-3 font-bold text-xl'>     𝓡𝓣𝓢</h1>
      <div>
        {sidebarItems.map((item, index) => (
          <div
            onClick={() => sidebarHandler(item.text)}
            key={index}
            className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
          >
            {item.icon}
            <span>{item.text}</span>

            {item.text === "Notifications" && likeNotification.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size='icon'
                    className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                  >
                    {likeNotification.length}
                  </Button>
                </PopoverTrigger>
                <PopoverContent sideOffset={10} className="w-64">
                  {likeNotification.map((notification) => (
                    <div key={notification.userId} className='flex items-center gap-2 my-2'>
                      <Avatar>
                        <AvatarImage src={notification.userDetails?.profilePicture} />
                        <AvatarFallback>{notification.userDetails?.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className='text-sm'>
                        <span className='font-bold'>{notification.userDetails?.username}</span> liked your post
                      </p>
                    </div>
                  ))}
                  {likeNotification.length === 0 && (
                    <p className="text-center text-sm text-gray-500">No new notifications</p>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden md:block fixed top-0 left-0 px-4 border-r border-gray-300 w-[16%] min-w-[200px] h-screen z-20 bg-white'>
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className='md:hidden fixed top-4 left-4 z-50'>
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </DialogTrigger>
          <DialogContent className='p-0 w-[80%] max-w-xs h-screen overflow-y-auto rounded-none border-none'>
            <SidebarContent />
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
  <DialogContent className="w-[90%] max-w-md p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Search Users</h2>
    <SearchBar closeModal={() => setSearchModalOpen(false)} />
  </DialogContent>
</Dialog>
      <CreatePost open={open} setOpen={setOpen} />
    </>
  )
}

export default LeftSidebar
