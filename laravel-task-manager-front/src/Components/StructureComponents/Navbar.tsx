import React from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../../Hooks/UtilHooks';

import { useAuthDispatch } from "../../Hooks/StateHooks";
import { logout } from "../../ContextAPIs/AuthSlice";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const logoutG = useLogout();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/dashboard" className="hover:text-gray-300">
            Task Manager
          </Link>
        </div>
        <div className="space-x-4">
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
          <button onClick={logoutG} className="hover:text-gray-300">
            Logout
          </button>
          {/* <Link to="/login" className="hover:text-gray-300">
            Logout
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
