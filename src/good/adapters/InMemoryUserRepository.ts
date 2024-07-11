import { GoodUserExample as User } from "../GoodUserExample";
import { UserRepositoryPort } from "../ports";

export const InMemoryUserRepository = (): UserRepositoryPort => {
  const users: User[] = [];
  return {
    findByEmail: async (email: string): Promise<User | null> => {
      const user = users.find((user) => user.email === email);
      if (!user) {
        return null;
      }
      return user;
    },
    create: async (user: User): Promise<User> => {
      users.push(user);
      return user;
    },
  };
};
