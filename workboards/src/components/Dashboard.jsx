// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useGetBoardsQuery } from '../store/api';

const Dashboard = () => {
  const { data: boards, error, isLoading } = useGetBoardsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My WorkBoards</h1>
          <div className="flex items-center">
            <span className="mr-4">Assigned to Me</span>
            <button className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-semibold">
              A
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards?.map((board) => (
                <Link key={board.id} to={`/board/${board.id}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{board.title}</h2>
                  <p className="text-gray-600">{board.tasks?.length || 0} task(s)</p>
                </Link>
              ))}
              <Link to="/create" className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex items-center justify-center hover:border-gray-400 transition-colors">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;