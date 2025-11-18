export interface UpdateTaskStateRequest {
  projectid: number;
  taskid: number;
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
}