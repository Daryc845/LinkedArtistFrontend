export interface RegisterResponse {
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}