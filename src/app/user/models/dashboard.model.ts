export interface User {
  id: number;
  name: string;
  lastName: string;
  alias: string;
  phone: string;
  email: string;
  password: string;
  skills: number[];
  bio: string;
}

export interface Skill {
  id: number;
  name: string;
  selected?: boolean;
}