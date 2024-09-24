import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import WorkBoardCard from '../components/WorkBoardCard';
import { getBoards, getCurrentUser, logout } from '../api';

const MyWorkBoardsPage = () => {
  const navigate = useNavigate();
  const [workBoards, setWorkBoards] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardsResponse, userResponse] = await Promise.all([
          getBoards(),
          getCurrentUser()
        ]);
        setWorkBoards(boardsResponse.data);
        setUsername(userResponse.data.username);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="My WorkBoards" showAssignedToMe={true} username={username} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/boards/new"
            className="h-32 flex items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
          >
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </Link>
          {workBoards.map((board) => (
            <WorkBoardCard
              key={board.id}
              id={board.id}
              title={board.title}
              taskCount={board.tasks ? board.tasks.length : 0}
              members={board.members || []}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyWorkBoardsPage;