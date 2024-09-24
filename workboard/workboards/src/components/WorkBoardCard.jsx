import React from 'react';
import { Link } from 'react-router-dom';

const WorkBoardCard = ({ id, title, taskCount, members }) => {
  return (
    <Link to={`/board/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{taskCount} tasks</span>
          <div className="flex -space-x-2">
            {members.map((member, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white"
              >
                {member.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkBoardCard;