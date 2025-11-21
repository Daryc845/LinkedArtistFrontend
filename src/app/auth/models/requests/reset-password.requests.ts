export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmationCode: string;
}