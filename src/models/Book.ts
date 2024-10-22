import mongoose, { Document, Schema } from "mongoose";

interface BookDocument extends Document {
  title: string;
  author: string;
  quantity: number;
  availableQuantity: number;
  createdAt: Date;
  updatedAt: Date;

  toJSON(): object;
}

const bookSchema: Schema = new mongoose.Schema<BookDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model<BookDocument>("Book", bookSchema);

export default Book;
