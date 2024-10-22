import _ from "lodash";

interface User {
  _id: string;
  username: string;
  emailAddress: string;
  isPenalized: boolean;
  penaltyEndDate: Date;
}

interface UserListResponse {
  user_id: string;
  username: string;
  email_address: string;
  is_penalized: boolean;
  penalty_end_date: Date;
}

// Convert result to the desired response structure
const GetUserListResponse = (result: User[]): UserListResponse[] => {
  return _.map(result, (item) => ({
    user_id: item._id,
    username: item.username,
    email_address: item.emailAddress,
    is_penalized: item.isPenalized,
    penalty_end_date: item.penaltyEndDate,
  }));
};

export default GetUserListResponse;
