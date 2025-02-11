// src/controllers/boardController.js
import Board from "../models/boardModel.js";

// Get the board for the logged-in user. If none exists, create a default board.
const getBoard = async (req, res) => {
  let board = await Board.findOne({ user: req.user._id });
  if (!board) {
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
};

// Update the board's lists (or other properties) and return the updated board.
const updateBoard = async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (board) {
    board.lists = req.body.lists || board.lists;
    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } else {
    res.status(404);
    throw new Error("Board not found");
  }
};

export { getBoard, updateBoard };
