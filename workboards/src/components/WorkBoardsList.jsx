import React, { useState, useEffect } from 'react';
import { getWorkBoards, createWorkBoard } from '../store/api';

const WorkBoardList = () => {
  const [workboards, setWorkboards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    fetchWorkBoards();
  }, []);

  const fetchWorkBoards = async () => {
    try {
      const response = await getWorkBoards();
      setWorkboards(response.data);
    } catch (error) {
      console.error('Error fetching workboards:', error);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      await createWorkBoard({ title: newBoardTitle });
      setNewBoardTitle('');
      fetchWorkBoards();
    } catch (error) {
      console.error('Error creating workboard:', error);
    }
  };

  return (
    <div>
      <h1>Work Boards</h1>
      <form onSubmit={handleCreateBoard}>
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="New board title"
        />
        <button type="submit">Create Board</button>
      </form>
      <ul>
        {workboards.map((board) => (
          <li key={board.id}>{board.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkBoardList;