import React from 'react';
import { useGetTasksQuery, useCreateTaskMutation } from '../store/api';

const TaskList = ({ boardId }) => {
  const { data: tasks = [], error, isLoading } = useGetTasksQuery(boardId);
  const [createTask] = useCreateTaskMutation();
  const [newTaskTitle, setNewTaskTitle] = React.useState('');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask({ boardId, newTask: { title: newTaskTitle } }).unwrap();
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error fetching tasks.</div>;

  return (
    <div>
      <h2>Tasks</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
        />
        <button type="submit">Create Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
