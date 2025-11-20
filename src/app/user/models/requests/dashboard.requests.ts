export interface UpdateUserRequest {
  userid: number;
  name: string;
  lastname: string;
  nickname?: string;
  cellphone: string;
  email: string;
  password?: string;
  skillIds: number[];
  biography: string;
}
