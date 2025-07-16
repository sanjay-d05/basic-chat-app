import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { FiEdit, FiLoader } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { updateAbout, updateProfilePic } from '@/services/userService';

function ProfilePage() {
  const { user, isUpdatingProfilePic , isUpdatingAbout } = useSelector((store) => store.auth);
  const { onlineUsers } = useSelector((store) => store.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isOnline = onlineUsers.includes(user._id);
  const [openUpdateProfilePic, setOpenUpdateProfilePic] = useState(false);
  const [openUpdateAbout, setOpenUpdateAbout] = useState(false);
  const [profilePicData, setProfilePicData] = useState({
    profilePic: user?.profilePic || '',
    profilePicName: '',
  });
  const [about,setAbout] = useState('');

  // Sync local profileData with Redux user
  const [profileData, setProfileData] = useState(user);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicData({
          profilePic: reader.result,
          profilePicName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfilePic = async (e) => {
    e.preventDefault();
    const base64Image = profilePicData.profilePic;
    const success = await dispatch(updateProfilePic(user?._id, base64Image));
    if (success) {
      setOpenUpdateProfilePic(false);
    }
  };

  const handleUpdateAbout = async(e) => {
    e.preventDefault();
    const success = await dispatch(updateAbout(user?._id,profileData?.about));
    if(success){
      setOpenUpdateAbout(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center px-4 py-6 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-6 border-b pb-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Hello, <span className="text-blue-600">{profileData?.name}</span>
        </h2>
        <IoArrowBack
          className="md:hidden text-xl text-gray-600 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Avatar with Edit Icon */}
        <div className="relative w-32 h-32">
          {profileData?.profilePic ? (
            <img
              className="w-full h-full rounded-full border-4 border-blue-600 object-cover shadow-md"
              src={profileData.profilePic}
              alt="User"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white shadow-md">
              {profileData?.name[0]}
            </div>
          )}

          {/* Edit Profile Picture Dialog */}
          <Dialog open={openUpdateProfilePic} onOpenChange={setOpenUpdateProfilePic}>
            <DialogTrigger asChild>
              <button
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full shadow transition"
                title="Edit Profile Picture"
              >
                <FiEdit size={16} />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] ">
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
                <DialogDescription>
                  Choose a new profile picture to upload. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpdateProfilePic} className="grid gap-4">
                <div className="grid gap-3">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium">Profile Picture</label>
                    <div className="border-2 border-dashed rounded-md w-full h-40 flex items-center justify-center relative border-black hover:border-blue-500 transition duration-300">
                      <label htmlFor="profile-upload" className="cursor-pointer text-center text-black hover:text-blue-400">
                        {profilePicData.profilePic ? (
                          <>
                            <img
                              src={profilePicData.profilePic}
                              alt="Profile"
                              className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
                            />
                            <p className="font-medium">Change picture</p>
                          </>
                        ) : (
                          <>
                            Click to upload image
                            <br />
                            <span className="text-sm text-white/50">(JPG, PNG, etc.)</span>
                          </>
                        )}
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    {profilePicData.profilePicName && (
                      <p className="mt-2 text-sm text-white/70">Selected: {profilePicData.profilePicName}</p>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={() => setProfilePicData({ profilePic: user?.profilePic })} className="bg-indigo-600 hover:bg-red-600">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isUpdatingProfilePic}>
                    {isUpdatingProfilePic ? <FiLoader className="size-5 animate-spin" /> : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Info */}
        <div className="w-full space-y-4 text-gray-700">
          <div>
            <p className="text-sm font-semibold">Name</p>
            <p className="text-base">{profileData?.name}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-base">{profileData?.email}</p>
          </div>

          {/* About Section with Edit Button */}
          <Dialog open={openUpdateAbout} onOpenChange={setOpenUpdateAbout}>
            <div className="relative">
              <p className="text-sm font-semibold">About</p>
              <p className="text-base text-gray-600 pr-8">
                {profileData?.about || 'Tell about yourself...'}
              </p>
              <DialogTrigger asChild>
                <Button className="absolute top-0 right-0 w-6 h-6 p-0 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full shadow">
                  <FiEdit size={12} />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit About</DialogTitle>
                  <DialogDescription>Write something about yourself.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateAbout}>
                  <textarea
                  className="w-full h-28 p-3 border rounded-md outline-none text-sm"
                  value={profileData.about}
                  onChange={(e) =>
                    setProfileData({ ...profileData, about: e.target.value })
                  }
                  placeholder="Enter about info"
                />
                <div className="flex justify-end mt-3">
                  <Button
                   type='submit'
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdatingAbout ? <FiLoader className='size-8 animate-spin' /> : 'Save'}
                  </Button>
                </div>
                </form>
              </DialogContent>
            </div>
          </Dialog>

          <div>
            <p className="text-sm font-semibold">Member Since</p>
            <p className="text-base">
              {new Date(profileData?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Status</p>
            <div className="flex items-center gap-1">
              {isOnline ? (
                <span className="text-xs text-green-500">Online</span>
              ) : (
                <span className="text-xs text-gray-400">Offline</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
