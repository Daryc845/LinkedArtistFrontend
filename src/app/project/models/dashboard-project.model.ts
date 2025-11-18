export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks?: {
    todo: string[];
    inProgress: string[];
    review: string[];
    done: string[];
  };
}