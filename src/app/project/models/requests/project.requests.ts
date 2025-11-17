export interface ProjectFilterRequest {
  title?: string;
  category?: string;
  type: 'public' | 'profile' | 'registered';
  skills: { name: string }[];
  active: boolean;
}

export interface ProjectJoinRequest {
  projectid: number;
}

export interface ProjectBasicInfoRequest {
  projectid: number;
}