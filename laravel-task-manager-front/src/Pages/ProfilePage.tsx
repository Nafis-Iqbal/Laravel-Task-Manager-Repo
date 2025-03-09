import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../Components/StructureComponents/HeroSection';
import ProfilePicture from '../Components/StructureComponents/ProfilePicture';
import UserInfo from '../Components/UserInfo';
import BasicTextDiv from '../Components/CustomDivElements';
import Footer from '../Components/StructureComponents/FooterSection';

const ProfilePage: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<string>('default_picture_url');
  
  return (
    <div className="p-8 min-h-screen space-y-8">
      <HeroSection />
      
      <div className="relative flex justify-center items-center">
        <ProfilePicture src={profilePicture} />
        <button
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
          onClick={() => alert("Change Profile Picture")}
        >
          Edit
        </button>
      </div>

      <UserInfo />

      <div className="flex space-x-2">
        <Link to="/projects">
          <BasicTextDiv
            displayText='Show Projects'
            customStyle='rounded-lg bg-green-500 text-white p-3'
          />
        </Link>
        <Link to="/tasks">
          <BasicTextDiv
            displayText='Show Tasks'
            customStyle='rounded-lg bg-green-500 text-white p-3'
          />
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
