export interface Project {
  title: string;
  description: string;
  categoryId: number;
  skills: string[];
  tasks: Task[];
}

export interface Task {
  id: number;
  name: string;
}