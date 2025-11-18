export interface Task {
  id: number;
  name: string;
  assignee?: string;
  state?: 'to be done' | 'in progress' | 'under review' | 'done';
}

export interface Member {
  id: number;
  name: string;
  alias?: string;
  email: string;
  isOwner: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks: {
    todo: Task[];
    inProgress: Task[];
    review: Task[];
    done: Task[];
  };
  members: Member[];
  requests: Request[];
}

export interface Request {
  id: number;
  name: string;
  alias?: string;
  email: string;
}