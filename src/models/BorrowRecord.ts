import mongoose, { Document, Model } from "mongoose";
import User from "./User";
import Book from "./Book";

interface BorrowRecordDocument extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
  status: "borrowed" | "returned";

  toJSON(): object;
}

interface BorrowRecordModel extends Model<BorrowRecordDocument> {
  findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<BorrowRecordDocument[]>;
  findByBookId(
    bookId: mongoose.Types.ObjectId
  ): Promise<BorrowRecordDocument[]>;
}

const borrowRecordSchema = new mongoose.Schema<BorrowRecordDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    borrowedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: "version",
  }
);

borrowRecordSchema.methods.toJSON = function (): object {
  const borrowRecord = this as BorrowRecordDocument;
  const borrowRecordObject = borrowRecord.toObject();

  return borrowRecordObject;
};

borrowRecordSchema.statics.findByUserId = async function (
  userId: mongoose.Types.ObjectId
): Promise<BorrowRecordDocument[]> {
  return this.find({ _id: userId });
};

borrowRecordSchema.statics.findByBookId = async function (
  bookId: mongoose.Types.ObjectId
): Promise<BorrowRecordDocument[]> {
  return this.find({ _id: bookId });
};

const BorrowRecord = mongoose.model<BorrowRecordDocument, BorrowRecordModel>(
  "BorrowRecord",
  borrowRecordSchema
);

export default BorrowRecord;
