// src/components/Board.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useGetWorkBoardQuery, useUpdateTaskMutation } from '../store/api';

const Board = () => {
  const { id } = useParams();
  const { data: workboard, error, isLoading } = useGetWorkBoardQuery(id);
  const [updateTask] = useUpdateTaskMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = workboard.tasks.find(t => t.id === parseInt(draggableId));
    const newStatus = destination.droppableId;

    try {
      await updateTask({ id: task.id, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const columns = {
    'todo': { id: 'todo', title: 'To Do', tasks: workboard.tasks.filter(t => t.status === 'todo') },
    'inprogress': { id: 'inprogress', title: 'In Progress', tasks: workboard.tasks.filter(t => t.status === 'inprogress') },
    'completed': { id: 'completed', title: 'Completed', tasks: workboard.tasks.filter(t => t.status === 'completed') },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workboard.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{workboard.description}</p>
          </div>
          <button className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-semibold">
            A
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(columns).map((column) => (
                <div key={column.id} className="bg-gray-200 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-4 mb-2 rounded shadow"
                              >
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">{task.title}</p>
                                  {task.assignee && (
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                      {task.assignee.username}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
};

export default Board;