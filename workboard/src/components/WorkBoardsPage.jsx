import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function WorkBoardsPage() {
  const [workBoards, setWorkBoards] = useState([]);

  useEffect(() => {
    // TODO: Fetch work boards from API
    setWorkBoards([
      { id: '1', title: 'Project Alpha', description: 'Our main project' },
      { id: '2', title: 'Marketing Campaign', description: 'Q4 marketing initiatives' },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My WorkBoards</h1>
        <div className="flex items-center space-x-4">
          <span>Assigned to Me</span>
          <Link to="/" className="text-blue-500 hover:text-blue-600">Logout</Link>
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
            Y
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workBoards.map((board) => (
          <Link key={board.id} to={`/board/${board.id}`} className="block">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{board.title}</h2>
              <p className="text-gray-600">{board.description}</p>
            </div>
          </Link>
        ))}
        <Link to="/create-board" className="block">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-center h-full">
            <span className="text-4xl text-gray-400">+</span>
          </div>
        </Link>
      </div>
    </div>
  );
}