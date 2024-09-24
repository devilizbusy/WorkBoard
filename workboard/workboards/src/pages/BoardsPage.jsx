import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBoards } from '../api';

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      } 
      const response = await getBoards();
      setBoards(response.data);
      }
      catch (err) {
        console.error('Error fetching boards:', err);
        setError('Failed to fetch boards. Please try again later.');
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My WorkBoards</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Link key={board.id} to={`/boards/${board.id}`} className="block">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{board.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{board.description}</p>
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/create-board" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">Create a new board</span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardsPage;