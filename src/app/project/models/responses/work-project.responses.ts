export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface ProjectResponse extends BaseResponse {
  data?: {
    title: string;
    description: string;
    category: string;
    skills: { name: string }[];
    tasks: TaskResponse[];
  };
}

export interface TaskResponse {
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
  user?: {
    userId: number;
    name: string;
    lastname: string;
    nickname?: string;
    email: string;
  };
}

export interface MembersResponse extends BaseResponse {
  data?: {
    members: MemberResponse[];
  };
}

export interface MemberResponse {
  userId: number;
  name: string;
  lastname: string;
  nickname?: string;
  email: string;
  isOwner: boolean;
}