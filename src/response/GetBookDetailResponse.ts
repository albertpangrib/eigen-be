interface Book {
  id: string;
  title: string;
  author: string;
  quantity: number;
  availableQuantity: number;
}

interface BookDetailResponse {
  id: string;
  title: string;
  author: string;
  quantity: number;
  available_quantity: number;
}

const GetBookDetailResponse = (result: Book): BookDetailResponse => {
  return {
    id: result.id,
    title: result.title,
    author: result.author,
    quantity: result.quantity,
    available_quantity: result.availableQuantity,
  };
};

export default GetBookDetailResponse;
