// boardRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import Board from "../models/boardModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get user's board
// @route   GET /api/boards
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    let board = await Board.findOne({ user: req.user._id });

    if (!board) {
      // Create a default board if none exists
      board = await Board.create({
        user: req.user._id,
        lists: [
          { title: "To Do", tasks: [], order: 0 },
          { title: "In Progress", tasks: [], order: 1 },
          { title: "Done", tasks: [], order: 2 },
        ],
      });
    }

    res.json(board);
  })
);

// @desc    Add a new list
// @route   POST /api/boards/add-list
// @access  Private
router.post(
  "/add-list",
  protect,
  asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      res.status(400);
      throw new Error("Title is required");
    }

    // Find the user's board
    const board = await Board.findOne({ user: req.user._id });
    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    // Create a new list object
    const newList = {
      title,
      tasks: [],
      order: board.lists.length, // order at the end of the current lists
    };

    board.lists.push(newList);
    await board.save();
    res.status(201).json(board);
  })
);

// @desc    Add a new task
// @route   POST /api/boards/tasks
// @access  Private
router.post(
  "/tasks",
  protect,
  asyncHandler(async (req, res) => {
    const { listId, title, description, dueDate, priority } = req.body;

    const board = await Board.findOne({ user: req.user._id });
    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const list = board.lists.id(listId);
    if (!list) {
      res.status(404);
      throw new Error("List not found");
    }

    list.tasks.push({
      title,
      description,
      dueDate,
      priority,
      order: list.tasks.length,
    });

    await board.save();
    res.status(201).json(board);
  })
);

// @desc    Move a task
// @route   PUT /api/boards/move-task
// @access  Private
router.put(
  "/move-task",
  protect,
  asyncHandler(async (req, res) => {
    const { taskId, sourceListId, destinationListId, newIndex } = req.body;

    const board = await Board.findOne({ user: req.user._id });
    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const sourceList = board.lists.id(sourceListId);
    const destinationList = board.lists.id(destinationListId);
    if (!sourceList || !destinationList) {
      res.status(404);
      throw new Error("List not found");
    }

    const taskIndex = sourceList.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );
    if (taskIndex === -1) {
      res.status(404);
      throw new Error("Task not found");
    }

    // Remove task from source list
    const [task] = sourceList.tasks.splice(taskIndex, 1);
    // Add task to destination list at specified index
    destinationList.tasks.splice(newIndex, 0, task);
    // Update task orders
    destinationList.tasks.forEach((task, index) => {
      task.order = index;
    });

    await board.save();
    res.json(board);
  })
);

export default router;
