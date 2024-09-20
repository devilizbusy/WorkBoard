import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateWorkBoardPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', status: 'To-Do' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send data to API
    console.log({ title, description, tasks });
    navigate('/boards');
  };

  const addTask = () => {
    if (newTask.title) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: '', description: '', assignedTo: '', status: 'To-Do' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create a WorkBoard</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/boards')} className="text-blue-500 hover:text-blue-600">Logout</button>
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
            Y
          </div>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Name your Board</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Board description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={3}
          ></textarea>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Tasks</h3>
          {tasks.map((task, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <p><strong>{task.title}</strong> - Assigned to: {task.assignedTo || 'Unassigned'}</p>
              <p>{task.description}</p>
            </div>
          ))}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <textarea
              placeholder="Task Description (Optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={2}
            ></textarea>
            <input
              type="text"
              placeholder="Assign others with @"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <button
              type="button"
              onClick={addTask}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              + Add a Task
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Work Board
          </button>
        </div>
      </form>
    </div>
  );
}