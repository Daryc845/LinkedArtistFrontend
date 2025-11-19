export interface UpdateUserRequest {
  userid: number;
  name: string;
  lastname: string;
  nickname?: string;
  cellphone: string;
  email: string;
  password?: string;
  skills: { name: string }[];
  biography: string;
}