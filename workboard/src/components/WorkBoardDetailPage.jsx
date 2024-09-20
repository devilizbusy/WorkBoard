import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function WorkBoardDetailPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // TODO: Fetch board data from API
    setBoard({
      id: id || '1',
      title: 'My First Work Board',
      description: 'I made this board as an assignment for ButtonShift',
      tasks: [
        { id: '1', title: 'Complete ButtonShift Assignment', description: 'Must complete this task in 3 days if I have taken it up.', assignedTo: 'amit@fotoley.com', status: 'To-Do' },
      ],
    });
  }, [id]);

  const onDragEnd = (result) => {
    if (!result.destination || !board) return;

    const newTasks = Array.from(board.tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    reorderedItem.status = result.destination.droppableId;
    newTasks.splice(result.destination.index, 0, reorderedItem);

    setBoard({ ...board, tasks: newTasks });
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <Link to="/boards" className="text-blue-500 hover:text-blue-600">My Workboards</Link>
          <h1 className="text-2xl font-bold">{board.title}</h1>
          <p className="text-gray-600">{board.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-blue-500 hover:text-blue-600">Logout</Link>
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
            Y
          </div>
        </div>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['To-Do', 'In Progress', 'Completed'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded-lg"
                >
                  <h2 className="text-lg font-semibold mb-4">{status}</h2>
                  {board.tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 mb-2 rounded shadow"
                          >
                            <h3 className="font-bold">{task.title}</h3>
                            <p>{task.description}</p>
                            <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}