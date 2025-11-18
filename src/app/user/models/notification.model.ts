export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'request';
  read: boolean;
}