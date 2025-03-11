import React from 'react';

const ProfilePicture = ({ src, customStyle } : {src: string, customStyle?: string}) => {
  return (
    <div className={`w-32 h-32 rounded-lg overflow-hidden relative ${customStyle}`}>
      <img src={src} alt="User profile" className="object-cover w-full h-full" />
      <button
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
          onClick={() => alert("Change Profile Picture")}
        >
          Edit
      </button>
    </div>
  );
};

export default ProfilePicture;
