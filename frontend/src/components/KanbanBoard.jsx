import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import List from "./List";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const KanbanBoard = () => {
  const [lists, setLists] = useState([
    { id: "list-1", title: "To Do", tasks: [] },
    { id: "list-2", title: "In Progress", tasks: [] },
    { id: "list-3", title: "Done", tasks: [] },
  ]);

  const navigate = useNavigate();

  // Function to add a new list
  const addList = (title) => {
    const newList = { id: uuidv4(), title, tasks: [] };
    setLists((prevLists) => [...prevLists, newList]);
    toast.success("List added successfully!");
  };

  // Function to update a list (for editing title and tasks)
  const updateList = (listId, updatedList) => {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === listId ? updatedList : list))
    );
  };

  // Function to delete a list
  const deleteList = (listId) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    toast.info("List deleted.");
  };

  // Handle drag-and-drop of tasks using functional state updates
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    setLists((prevLists) => {
      // If dragging within the same list
      if (source.droppableId === destination.droppableId) {
        return prevLists.map((list) => {
          if (list.id === source.droppableId) {
            const newTasks = Array.from(list.tasks);
            const [removed] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, removed);
            return { ...list, tasks: newTasks };
          }
          return list;
        });
      } else {
        // Moving task between lists
        const sourceIndex = prevLists.findIndex(
          (list) => list.id === source.droppableId
        );
        const destIndex = prevLists.findIndex(
          (list) => list.id === destination.droppableId
        );

        const sourceList = { ...prevLists[sourceIndex] };
        const destList = { ...prevLists[destIndex] };

        const sourceTasks = Array.from(sourceList.tasks);
        const destTasks = Array.from(destList.tasks);

        const [removed] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, removed);

        sourceList.tasks = sourceTasks;
        destList.tasks = destTasks;

        const newLists = [...prevLists];
        newLists[sourceIndex] = sourceList;
        newLists[destIndex] = destList;
        return newLists;
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 text-gray-200">
      {/* Inline style block to define a custom slide-in animation */}
      <style>{`
        @keyframes slideIn {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 1.5s ease-out forwards;
        }
      `}</style>

      {/* Logout Button */}
      <button
        onClick={() => {
          toast.info("Logged out successfully!");
          navigate("/");
        }}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Logout
      </button>

      {/* Animated Greeting */}
      <h1 className="text-4xl font-bold mb-8 animate-slideIn text-gray-100">
        Hello User, Welcome to your Kanban Board
      </h1>

      {/* New List Form */}
      <NewListForm addList={addList} />

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-auto">
          {lists.map((list) => (
            <List
              key={list.id}
              list={list}
              updateList={updateList}
              deleteList={deleteList}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const NewListForm = ({ addList }) => {
  const [title, setTitle] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    addList(title);
    setTitle("");
  };
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="New list title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border border-gray-400 rounded mr-2 bg-white text-black"
      />
      <button
        type="submit"
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add List
      </button>
    </form>
  );
};

export default KanbanBoard;
