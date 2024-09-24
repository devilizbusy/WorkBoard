import React from 'react';

const Header = ({ title, showAssignedToMe = false, username, onLogout }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-900 mr-4">{title}</h1>
          {showAssignedToMe && <span className="text-sm text-gray-500">Assigned to Me</span>}
        </div>
        <div className="flex items-center">
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-gray-700 mr-4"
          >
            Logout
          </button>
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;