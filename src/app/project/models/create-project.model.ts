export interface Project {
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks: Task[];
}

export interface Task {
  id: number;
  name: string;
}