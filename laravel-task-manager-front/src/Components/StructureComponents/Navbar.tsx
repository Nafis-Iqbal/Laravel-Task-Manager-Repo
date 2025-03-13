import React from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../../Hooks/UtilHooks';

const Navbar: React.FC = () => {
  const logoutG = useLogout();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-4xl font-bold ml-5">
          <Link to="/dashboard" className="hover:text-gray-300">
            Task Manager
          </Link>
        </div>
        <div className="space-x-8 mr-5 text-2xl">
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/tasks" className="hover:text-gray-300">
            Tasks
          </Link>
          <Link to="/projects" className="hover:text-gray-300">
            Projects
          </Link>
          <Link to="/profile" className="hover:text-gray-300">
            Profile
          </Link>
          <button onClick={() => {
            logoutG();
          }} className="hover:text-gray-300">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
