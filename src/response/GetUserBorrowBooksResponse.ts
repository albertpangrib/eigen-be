// GetUserBorrowBooksResponse.ts

interface BorrowedBook {
  _id: string;
  title: string;
  borrowed_at: Date;
  due_date: Date;
  status: "borrowed" | "returned";
}

interface UserBorrowBooksResponse {
  user_id: string;
  username: string;
  email_address: string;
  borrow_count: number;
  borrowed_books: BorrowedBook[];
}

const GetUserBorrowBooksResponse = (
  user: any,
  borrowRecords: any[],
  borrowedBooks: BorrowedBook[]
): UserBorrowBooksResponse => {
  return {
    user_id: user._id.toString(),
    username: user.username,
    email_address: user.emailAddress,
    borrow_count: borrowRecords.length,
    borrowed_books: borrowedBooks,
  };
};

export default GetUserBorrowBooksResponse;
