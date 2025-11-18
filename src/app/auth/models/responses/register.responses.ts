export interface RegisterResponse {
  success: boolean;
  message: string;
  body: {
    access_token: string;
    refresh_token: string;
  };
}