export interface ProjectSkill {
  name: string;
}

export interface ProjectTask {
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
}

export interface ProjectBasic {
  projectid: number;
  title: string;
  description: string;
  category: string;
  skills: ProjectSkill[];
}

export interface ProjectDetail extends ProjectBasic {
  tasks: ProjectTask[];
}

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: {
    projects: ProjectBasic[];
  };
}

export interface ProjectJoinResponse {
  success: boolean;
  message: string;
}

export interface ProjectBasicInfoResponse {
  success: boolean;
  message: string;
  data: ProjectDetail;
}