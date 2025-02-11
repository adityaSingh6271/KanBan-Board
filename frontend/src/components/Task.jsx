//Task.jsx

import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

// Task component representing a single draggable task item.
const Task = ({ task, index, handleDeleteTask, handleUpdateTask }) => {
  // Local state to track if the task is in editing mode.
  const [isEditing, setIsEditing] = useState(false);
  // Local state to manage the edited task values.
  const [editedTask, setEditedTask] = useState(task);

  // Handler for submitting the edited task.
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Update the task using the provided callback.
    handleUpdateTask(editedTask);
    // Exit editing mode.
    setIsEditing(false);
  };

  return (
    // Wrap the task component in a Draggable provided by react-beautiful-dnd.
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          // Styling for the task container.
          className="bg-gray-800 p-2 rounded shadow text-white"
          // Attach the ref provided by react-beautiful-dnd.
          ref={provided.innerRef}
          // Spread draggable properties so the library can handle dragging.
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            // Render the editing form if the task is in editing mode.
            <form onSubmit={handleEditSubmit} className="space-y-2">
              {/* Input for task title */}
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="p-1 border border-gray-500 rounded w-full bg-gray-700 text-white"
                required
              />
              {/* Textarea for task description */}
              <textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                className="p-1 border border-gray-500 rounded w-full bg-gray-700 text-white"
              ></textarea>
              {/* Input for task due date */}
              <input
                type="date"
                value={editedTask.dueDate}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dueDate: e.target.value })
                }
                className="p-1 border border-gray-500 rounded w-full bg-gray-700 text-white"
              />
              {/* Select dropdown for task priority */}
              <select
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, priority: e.target.value })
                }
                className="p-1 border border-gray-500 rounded w-full bg-gray-700 text-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {/* Action buttons for Save and Cancel */}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  type="button"
                  className="bg-gray-600 text-white p-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Render the task details if not in editing mode.
            <div>
              {/* Display task title */}
              <h3 className="font-bold">{task.title}</h3>
              {/* Display task description */}
              <p>{task.description}</p>
              {/* Display task due date */}
              <p>Due: {task.dueDate}</p>
              {/* Display task priority */}
              <p>Priority: {task.priority}</p>
              {/* Action buttons to edit or delete the task */}
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
