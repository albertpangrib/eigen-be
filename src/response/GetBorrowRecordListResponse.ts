import _ from "lodash";

interface BorrowRecord {
  userId: string;
  bookId: string;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date;
}
interface BorrowRecordListResponse {
  user_id: string;
  book_id: string;
  borrowed_at: Date;
  due_date: Date;
  returned_at: Date;
}

const GetBorrowRecordListResponse = (
  result: BorrowRecord[]
): BorrowRecordListResponse[] => {
  return _.map(result, (item) => ({
    user_id: item.userId,
    book_id: item.bookId,
    borrowed_at: item.borrowedAt,
    due_date: item.dueDate,
    returned_at: item.returnedAt,
  }));
};

export default GetBorrowRecordListResponse;
