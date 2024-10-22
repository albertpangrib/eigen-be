interface User {
  id: string;
  username: string;
  emailAddress: string;
  isPenaltized: Date;
  penaltyEndDate: Date;
}

interface UserDetailResponse {
  id: string;
  username: string;
  email_address: string;
  is_penaltized: Date;
  penalty_end_date: Date;
}

const GetUserDetailResponse = (result: User): UserDetailResponse => {
  return {
    id: result.id,
    username: result.username,
    email_address: result.emailAddress,
    is_penaltized: result.isPenaltized,
    penalty_end_date: result.penaltyEndDate,
  };
};

export default GetUserDetailResponse;
