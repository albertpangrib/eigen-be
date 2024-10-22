export default interface UserType {
  _id: string;
  username: string;
  emailAddress: string;
  password: string;
  isPenalized: boolean;
  penaltyEndDate: Date;
  tokens: Array<{ token: string }>;
}
