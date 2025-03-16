import React from 'react';
import SocialLinks from '../ElementComponents/SocialIcons';


const LandingPageBar: React.FC = () => {
  return (
    <nav className="bg-blue-900 text-white p-4 mb-2">
      <div className="flex justify-between items-center min-h-[80px]">
        <h1 className='text-4xl text-center font-bold'>Task Manager</h1>
        
        <div className='flex flex-col px-2'>
            <p className="text-xl text-white">
                Developed by {" "}
                <span className="text-red-400 text-2xl font-bold drop-shadow-m">Nafis Iqbal</span>
            </p>
            {SocialLinks()}
        </div>
      </div>
    </nav>
  );
};

export default LandingPageBar;