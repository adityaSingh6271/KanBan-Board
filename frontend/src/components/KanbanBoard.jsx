// src/components/KanbanBoard.jsx
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import List from "./List";
import axios from "axios";
import { toast } from "react-toastify";

// Set the Axios base URL so that API calls target your backend.
axios.defaults.baseURL = "http://localhost:5000";

// Set the Authorization header if a token exists in localStorage.
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  console.log("Axios authorization token set:", token);
} else {
  console.warn("No token found in localStorage. Please log in first.");
}

const KanbanBoard = () => {
  const [lists, setLists] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const navigate = useNavigate();

  // Helper to transform backend list and task IDs (_id -> id)
  const transformLists = (lists) =>
    lists.map((list) => ({
      id: list._id,
      title: list.title,
      order: list.order,
      tasks: (list.tasks || []).map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        order: task.order,
      })),
    }));

  // Fetch board data from the backend on mount
  const fetchBoard = async () => {
    try {
      const { data } = await axios.get("/api/boards");
      setLists(transformLists(data.lists || []));
      setBoardId(data._id);
    } catch (error) {
      console.error("Failed to fetch board", error);
      toast.error("Failed to fetch board data.");
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  // Update board on backend and update local state with returned data
  const updateBoardBackend = async (updatedLists) => {
    if (!boardId) return;
    try {
      const { data } = await axios.put(`/api/boards/${boardId}`, {
        lists: updatedLists,
      });
      setLists(transformLists(data.lists || []));
    } catch (error) {
      console.error("Failed to update board", error);
      toast.error("Failed to update board data.");
    }
  };

  // Function to add a new list using the backend endpoint
  const addList = async (title) => {
    try {
      const { data } = await axios.post("/api/boards/add-list", { title });
      toast.success("List added successfully!");
      setLists(transformLists(data.lists || []));
      setBoardId(data._id);
    } catch (error) {
      console.error("Failed to add list", error);
      toast.error("Failed to add list");
    }
  };

  // Function to update a list
  const updateList = (listId, updatedList) => {
    const updatedLists = lists.map((list) =>
      list.id === listId ? updatedList : list
    );
    setLists(updatedLists);
    updateBoardBackend(updatedLists);
  };

  // Function to delete a list
  const deleteList = (listId) => {
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);
    updateBoardBackend(updatedLists);
    toast.info("List deleted.");
  };

  // Handle drag-and-drop using a simplified approach
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceListIndex = lists.findIndex(
      (list) => list.id === source.droppableId
    );
    const destListIndex = lists.findIndex(
      (list) => list.id === destination.droppableId
    );
    if (sourceListIndex === -1 || destListIndex === -1) return;
    const newLists = [...lists];
    if (source.droppableId === destination.droppableId) {
      // Moving task within the same list.
      const list = { ...newLists[sourceListIndex] };
      const newTasks = Array.from(list.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      list.tasks = newTasks;
      newLists[sourceListIndex] = list;
    } else {
      // Moving task between lists.
      const sourceList = { ...newLists[sourceListIndex] };
      const destList = { ...newLists[destListIndex] };
      const sourceTasks = Array.from(sourceList.tasks);
      const destTasks = Array.from(destList.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);
      sourceList.tasks = sourceTasks;
      destList.tasks = destTasks;
      newLists[sourceListIndex] = sourceList;
      newLists[destListIndex] = destList;
    }
    setLists(newLists);
    updateBoardBackend(newLists);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4 text-gray-200">
      {/* Inline style block for slide-in animation */}
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
        className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
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
