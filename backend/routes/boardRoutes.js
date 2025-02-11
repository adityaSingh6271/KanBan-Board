// src/routes/boardRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import { getBoard, updateBoard } from "../controllers/boardController.js";
import Board from "../models/boardModel.js"; // Import the Board model

const router = express.Router();

/**
 * @desc    Get user's board
 * @route   GET /api/boards
 * @access  Private
 */
router.get("/", protect, asyncHandler(getBoard));

/**
 * @desc    Update user's board (e.g., update lists)
 * @route   PUT /api/boards/:id
 * @access  Private
 */
router.put("/:id", protect, asyncHandler(updateBoard));

/**
 * @desc    Add a new list to the user's board
 * @route   POST /api/boards/add-list
 * @access  Private
 */
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
    // Create a new list object with an order equal to the current number of lists
    const newList = {
      title,
      tasks: [],
      order: board.lists.length,
    };
    board.lists.push(newList);
    await board.save();
    res.status(201).json(board);
  })
);

/**
 * @desc    Add a new task to a list in the user's board
 * @route   POST /api/boards/tasks
 * @access  Private
 */
router.post(
  "/tasks",
  protect,
  asyncHandler(async (req, res) => {
    const { listId, title, description, dueDate, priority } = req.body;
    // Find the board for the logged-in user
    const board = await Board.findOne({ user: req.user._id });
    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }
    // Find the specified list by its id
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

/**
 * @desc    Move a task from one list to another (or within the same list)
 * @route   PUT /api/boards/move-task
 * @access  Private
 */
router.put(
  "/move-task",
  protect,
  asyncHandler(async (req, res) => {
    const { taskId, sourceListId, destinationListId, newIndex } = req.body;
    // Find the board for the logged-in user
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
    const [task] = sourceList.tasks.splice(taskIndex, 1);
    destinationList.tasks.splice(newIndex, 0, task);
    destinationList.tasks.forEach((task, index) => {
      task.order = index;
    });
    await board.save();
    res.json(board);
  })
);

export default router;
