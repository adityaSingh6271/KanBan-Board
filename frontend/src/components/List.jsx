//List.jsx
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";
import { v4 as uuidv4 } from "uuid";

const List = ({ list, updateList, deleteList }) => {
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  const [editingTitle, setEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  // Add a new task to this list
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) return;
    const newTask = { id: uuidv4(), ...newTaskData };
    updateList(list.id, { ...list, tasks: [...list.tasks, newTask] });
    setNewTaskData({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
    });
  };

  // Delete a task from this list
  const handleDeleteTask = (taskId) => {
    const updatedTasks = list.tasks.filter((task) => task.id !== taskId);
    updateList(list.id, { ...list, tasks: updatedTasks });
  };

  // Update a task in this list
  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = list.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    updateList(list.id, { ...list, tasks: updatedTasks });
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    updateList(list.id, { ...list, title: listTitle });
    setEditingTitle(false);
  };

  return (
    <div className="bg-gray-700 p-4 rounded w-80 flex-shrink-0 text-white">
      <div className="flex justify-between items-center mb-2">
        {editingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-grow">
            <input
              type="text"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className="p-1 w-full bg-gray-600 text-white border border-gray-500 rounded"
            />
          </form>
        ) : (
          <h2
            className="font-bold text-white cursor-pointer"
            onDoubleClick={() => setEditingTitle(true)}
          >
            {list.title}
          </h2>
        )}
        <button
          onClick={() => deleteList(list.id)}
          className="text-red-400 text-sm"
        >
          Delete
        </button>
      </div>
      <Droppable droppableId={list.id}>
        {(provided) => (
          <div
            className="min-h-[50px] space-y-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                handleDeleteTask={handleDeleteTask}
                handleUpdateTask={handleUpdateTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* Add New Task Form */}
      <form onSubmit={handleAddTask} className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Task title"
          value={newTaskData.title}
          onChange={(e) =>
            setNewTaskData({ ...newTaskData, title: e.target.value })
          }
          className="p-1 border border-gray-500 rounded w-full bg-gray-600 text-white"
          required
        />
        <textarea
          placeholder="Task description"
          value={newTaskData.description}
          onChange={(e) =>
            setNewTaskData({ ...newTaskData, description: e.target.value })
          }
          className="p-1 border border-gray-500 rounded w-full bg-gray-600 text-white"
        ></textarea>
        <input
          type="datetime-local"
          value={newTaskData.dueDate}
          onChange={(e) =>
            setNewTaskData({ ...newTaskData, dueDate: e.target.value })
          }
          className="p-1 border border-gray-500 rounded w-full bg-gray-600 text-white"
        />
        <select
          value={newTaskData.priority}
          onChange={(e) =>
            setNewTaskData({ ...newTaskData, priority: e.target.value })
          }
          className="p-1 border border-gray-500 rounded w-full bg-gray-600 text-white"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default List;
