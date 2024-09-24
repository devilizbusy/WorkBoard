import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Header from '../components/Header';
import { getBoard, updateTask, createTask, deleteTask, deleteBoard, getCurrentUser, logout } from '../api';

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState({});
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardResponse, userResponse] = await Promise.all([
          getBoard(id),
          getCurrentUser()
        ]);
        const boardData = boardResponse.data;
        setBoard(boardData);
        setUsername(userResponse.data.username);

        const columnsData = {
          'to-do': {
            id: 'to-do',
            title: "To-Do's",
            tasks: boardData.tasks.filter(task => task.status === 'To-Do'),
            bgColor: 'bg-gray-100'
          },
          'in-progress': {
            id: 'in-progress',
            title: 'In Progress',
            tasks: boardData.tasks.filter(task => task.status === 'In Progress'),
            bgColor: 'bg-blue-100'
          },
          'completed': {
            id: 'completed',
            title: 'Completed',
            tasks: boardData.tasks.filter(task => task.status === 'Completed'),
            bgColor: 'bg-green-100'
          }
        };
        setColumns(columnsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.tasks];
    const destItems = [...destColumn.tasks];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destItems
      }
    };

    setColumns(newColumns);

    try {
      await updateTask(removed.id, { status: destColumn.title });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCreateTask = async (columnId) => {
    const taskTitle = prompt('Enter task title:');
    if (taskTitle) {
      try {
        const newTask = await createTask({
          title: taskTitle,
          status: columns[columnId].title,
          board: id
        });
        const updatedColumns = { ...columns };
        updatedColumns[columnId].tasks.push(newTask.data);
        setColumns(updatedColumns);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        const updatedColumns = { ...columns };
        updatedColumns[columnId].tasks = updatedColumns[columnId].tasks.filter(task => task.id !== taskId);
        setColumns(updatedColumns);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const updateTaskStatus = async (columnId, taskId, newStatus) => {
    const updatedColumns = { ...columns };
    const taskIndex = updatedColumns[columnId].tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      updatedColumns[columnId].tasks[taskIndex].status = newStatus;
      setColumns(updatedColumns);

      try {
        await updateTask(taskId, { status: newStatus });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteBoard = async () => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await deleteBoard(id);
        navigate('/boards');
      } catch (error) {
        console.error('Error deleting board:', error);
      }
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title={board.name} username={username} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <button
            onClick={handleDeleteBoard}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Board
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="flex-1">
                <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-4 rounded-lg min-h-[200px] ${column.bgColor}`}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 mb-2 rounded shadow ${expandedTaskId === task.id ? 'bg-purple-100' : ''}`}
                              onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                            >
                              <div className="flex justify-between items-center">
                                <p className="font-semibold">{task.title}</p>
                                <div className="flex items-center">
                                  <button 
                                    className="text-red-500 mr-2 text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTask(columnId, task.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                    {task.assignee ? task.assignee.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                </div>
                              </div>
                              {expandedTaskId === task.id && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                  <p className="text-sm text-blue-500 mb-2">{task.assignee}</p>
                                  <select
                                    value={task.status}
                                    onChange={(e) => updateTaskStatus(columnId, task.id, e.target.value)}
                                    className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
                                  >
                                    <option value="To-Do">To-Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <button
                        onClick={() => handleCreateTask(columnId)}
                        className="w-full mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                      >
                        + Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
};

export default BoardDetailPage;