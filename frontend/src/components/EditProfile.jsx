import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: null,
    bio: user?.bio || '',
    gender: user?.gender || '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  const selectChangeHandler = (value) => {
    setInput((prev) => ({ ...prev, gender: value }));
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if (input.profilePhoto) {
      formData.append('profilePhoto', input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'https://instaclone-demo.onrender.com/api/v1/user/profile/edit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(
          setAuthUser({
            ...user,
            bio: res.data.user?.bio,
            profilePicture: res.data.user?.profilePicture,
            gender: res.data.user?.gender,
          })
        );
        toast.success(res.data.message || 'Profile updated successfully');
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || 'Something went wrong updating profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-6 sm:pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>

        {/* Avatar + Change Photo */}
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="User Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || 'No bio provided'}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
            accept="image/*"
          />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            Change photo
          </Button>
        </div>

        {/* Bio Input */}
        <div>
          <h1 className="font-bold text-sm mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            placeholder="Write something about yourself..."
            className="focus-visible:ring-transparent border border-gray-300"
          />
        </div>

        {/* Gender Select */}
        <div>
          <h1 className="font-bold text-sm mb-2">Gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          {loading ? (
            <Button disabled className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
