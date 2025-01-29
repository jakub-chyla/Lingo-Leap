export class User {
  id?: number;
  username?: string;
  password?: string;
  token?: string;
  refreshToken?: string;
  role?: string;
  email?: string;
  premium: boolean = false
}
