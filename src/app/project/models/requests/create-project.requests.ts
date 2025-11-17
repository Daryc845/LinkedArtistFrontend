export interface CreateProjectRequest {
  title: string;
  category: string;
  userId: string;
  skills: { name: string }[];
  initialTasks: { name: string }[];
}