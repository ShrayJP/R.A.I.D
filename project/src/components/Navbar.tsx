import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
            <img src="/Logo.png" alt="RAID Logo" className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold">R.A.I.D</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/disaster-identifier">
                <Button variant="ghost">Disaster Identifier</Button>
              </Link>
              <Link to="/resource">
                <Button variant="ghost">Resource Allocator</Button>
              </Link>
              <Link to="/resource-management">
                <Button variant="ghost">Resource Management</Button>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="ghost">Admin Panel</Button>
                </Link>
              )}
              
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/disaster-identifier"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Disaster Identifier
            </Link>
            <Link
              to="/resource"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Resource
            </Link>
            <Link
              to="/resource-management"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Resource Management
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Admin Panel
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;