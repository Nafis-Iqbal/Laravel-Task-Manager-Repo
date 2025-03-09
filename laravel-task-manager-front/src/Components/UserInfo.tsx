import React from 'react';

const UserInfo: React.FC = () => {
  const userInfo = {
    role: "Developer",
    phone: "+1234567890",
    address: "123 Main St, Springfield"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-medium mb-4">User Info</h3>
      <p><strong>Role:</strong> {userInfo.role}</p>
      <p><strong>Phone:</strong> {userInfo.phone}</p>
      <p><strong>Address:</strong> {userInfo.address}</p>
    </div>
  );
};

export default UserInfo;
