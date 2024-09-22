// src/components/CreateBoard.js
import React, { useState } from 'react';
import { useCreateWorkBoardMutation } from '../store/api';
import { useHistory } from 'react-router-dom';

const CreateBoard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createWorkBoard, { isLoading }] = useCreateWorkBoardMutation();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newWorkBoard = await createWorkBoard({ title, description }).unwrap();
      history.push(`/boar

d/${newWorkBoard.id}`);
    } catch (err) {
      console.error('Failed to create the work board:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Create a WorkBoard</h1>
          <button className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-semibold">
            A
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Name your Board
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Board Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Board description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Board Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Work Board'}
                </button>
                <button
                  onClick={() => history.push('/dashboard')}
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateBoard;