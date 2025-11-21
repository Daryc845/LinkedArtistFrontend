export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    updated: boolean;
  };
}