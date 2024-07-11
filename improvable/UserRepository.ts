import { User } from "../core/User";

export class UserRepository {
  private readonly users: User[] = [];

  constructor(users: User[] = []) {
    this.users = users;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`Searching for user with email: ${email}`);
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
