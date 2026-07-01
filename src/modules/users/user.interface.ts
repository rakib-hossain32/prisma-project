export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}

export interface IUpdateProfile {
  name: string;
  email: string;
  profilePhoto: string;
  bio: string;
}
