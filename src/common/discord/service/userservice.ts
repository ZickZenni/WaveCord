import { User } from '../user';

export default class UserService {
  private users: Map<string, User>;

  public constructor() {
    this.users = new Map();
  }

  public setUser(user: User) {
    this.users.set(user.id, user);
  }

  public getUsers(): Map<string, User> {
    return this.users;
  }
}
