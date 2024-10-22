interface SuccessResponse<T> {
  status: boolean;
  data: T | string; // Data can be of generic type T or a string
}

interface ErrorResponse {
  status: boolean;
  error: string | null; // Error can be a string or null
}

const responseUtils = {
  successResponse<T>(data?: T): SuccessResponse<T> {
    const defaultResponse: SuccessResponse<T> = {
      status: true,
      data: "Success",
    };

    if (data) {
      defaultResponse.data = data;
    }

    return defaultResponse;
  },

  errorResponse(error: any): ErrorResponse {
    return {
      status: false,
      error: error.message || error.errorMessage || error || null,
    };
  },
};

export default responseUtils;
