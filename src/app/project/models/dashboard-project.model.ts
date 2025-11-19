export interface TaskInfo {
  name: string;
  userEmail: string;
  userName: string;
  userLastname: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks?: {
    todo: TaskInfo[];
    inProgress: TaskInfo[];
    review: TaskInfo[];
    done: TaskInfo[];
  };
}