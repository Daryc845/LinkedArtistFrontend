export interface CreateProjectRequest {
  title: string;
  categoryId: number;
  description: string;
  userId: number;
  skills: { skillId: number }[];
  tasks: { name: string }[];
}