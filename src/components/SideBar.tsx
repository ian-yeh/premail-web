import React from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-dark-600 text-sm bg-gray-300 p-6 rounded-3xl'
      : 'text-gray-700 hover:bg-blue-200 p-6 rounded-3xl';

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed, ', err);
    }
  }

  return (
    <div className="font-display pd-4 w-100 h-screen flex justify-center items-center">
      <div className="w-9/10 h-19/20 rounded-2xl bg-blue-300 shadow-lg flex flex-col p-8 space-y-4">
        <h1 className="text-2xl font-semibold mb-6">PreMail</h1>
        <div className="flex flex-col space-y-2">
          <NavLink to="/home" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
