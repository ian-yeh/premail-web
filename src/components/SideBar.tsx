import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'flex items-center space-x-3 p-4 rounded-xl bg-white text-blue-600 shadow-sm transition-all'
      : 'flex items-center space-x-3 p-4 rounded-xl text-gray-600 hover:bg-white hover:text-blue-500 transition-all';

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
    <div className="h-screen w-64 flex flex-col bg-gradient-to-b from-blue-50 to-blue-100 p-4 border-r border-blue-200">
      {/**
       * Optional logo/header
      <div className="p-4 mb-8">
        <h1 className="text-xl font-bold text-blue-800">PreMail</h1>
      </div>
       */}
      
      <nav className="flex-1 space-y-2 mt-8">
        <NavLink to="/home" end className={linkClass}>
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          <ChartBarIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          <CogIcon className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-4 rounded-xl text-gray-600 hover:bg-white hover:text-red-500 transition-all"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;