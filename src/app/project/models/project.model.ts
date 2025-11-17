import { Task } from './task.model';

export interface Project {
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks: Task[];
}