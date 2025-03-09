import React from 'react';

interface ProfilePictureProps {
  src: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src }) => {
  return (
    <div className="w-32 h-32 rounded-full overflow-hidden">
      <img src={src} alt="User profile" className="object-cover w-full h-full" />
    </div>
  );
};

export default ProfilePicture;
