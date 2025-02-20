import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
  // Sample user data for demonstration purposes
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis leo libero, sit amet congue justo scelerisque sit amet.',
    phone: '(123) 456-7890',
    address: '123 Main Street, Springfield, USA',
  });

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen flex flex-col items-center py-12">
      {/* Profile Card */}
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-6 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
          <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-lg text-gray-600">{user.email}</p>
        </div>

        {/* Bio Section */}
        <section className="text-center space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">About Me</h3>
          <p className="text-gray-600 text-lg">{user.bio}</p>
        </section>

        {/* User Info */}
        <section className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <h4 className="text-gray-700 font-semibold">Phone:</h4>
            <p className="text-gray-600">{user.phone}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="text-gray-700 font-semibold">Address:</h4>
            <p className="text-gray-600">{user.address}</p>
          </div>
        </section>

        {/* Edit Profile and Logout Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
            Edit Profile
          </button>
          <button className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
