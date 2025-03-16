import React from 'react';
import ProfilePicture from './StructureComponents/ProfilePicture';

const UserInfo = ({profilePicture} : {profilePicture: string}) => {
  const userInfo = {
    name: "Nafis Iqbal",
    role: "Developer",
    phone: "+1234567890"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <ProfilePicture src={profilePicture} customStyle="mb-2"/>
      <h3 className="text-xl font-medium mb-4">User Info</h3>
      <p><strong>Name:</strong> {userInfo.name}</p>
      <p><strong>Role:</strong> {userInfo.role}</p>
      <p><strong>Phone:</strong> {userInfo.phone}</p>
    </div>
  );
};

export default UserInfo;
