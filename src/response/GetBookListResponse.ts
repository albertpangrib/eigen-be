import _ from "lodash";

interface Book {
  _id: string;
  title: string;
  author: string;
  quantity: number;
  availableQuantity: number;
}
interface BookListResponse {
  book_id: string;
  title: string;
  author: string;
  quantity: number;
  available_quantity: number;
}

const GetBookListResponse = (result: Book[]): BookListResponse[] => {
  return _.map(result, (item) => ({
    book_id: item._id,
    title: item.title,
    author: item.author,
    quantity: item.quantity,
    available_quantity: item.availableQuantity,
  }));
};

export default GetBookListResponse;
