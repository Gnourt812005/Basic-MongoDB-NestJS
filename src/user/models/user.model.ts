export class UserModel {
  id: string 
  email: string;
  password: string;
  createdAt: Date;

  constructor(data: Partial<UserModel>) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.createdAt = data.createdAt || new Date()
  }
}