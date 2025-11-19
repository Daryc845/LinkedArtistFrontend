export interface BaseResponse {
  code: number;
  message: string;
}

export interface UserResponse extends BaseResponse {
  data?: {
    name: string;
    lastname: string;
    nickname?: string;
    cellphone: string;
    email: string;
    password: string;
    skills: { name: string }[];
    biography: string;
  };
}

export interface UpdateUserResponse extends BaseResponse {
  body?: {
    token: string;
  };
}