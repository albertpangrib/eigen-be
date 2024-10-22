class BusinessExceptionClass extends Error {
  errorCode: number | null;

  constructor(
    errorCode: number | null = null,
    message: string = "An Error occured",
  ) {
    super(message); // Call the parent constructor with the message
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    this.name = "BusinessException"; // Set the name of the error
    this.errorCode = errorCode; // Set the error code
  }
}

// Function to create a not found exception
const notFound = (item: string) => {
  return new BusinessExceptionClass(404, `${item} not found`);
};

// Export the class and function
export default {
  ExceptionClass: BusinessExceptionClass,
  notFound: notFound,
};
