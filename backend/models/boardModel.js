import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const listSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tasks: [taskSchema],
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const boardSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    lists: [listSchema],
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model('Board', boardSchema);
export default Board;