import { GoodUserExample as User } from "./GoodUserExample";
import { User as UserDto } from "../core";

export interface CreatableRepositoryPort<T> {
  create(input: T): Promise<T>;
}

export interface UserRepositoryPort extends CreatableRepositoryPort<User> {
  findByEmail(email: string): Promise<User | null>;
}

export interface EmailSenderPort {
  sendEmail(email: string): Promise<void>;
}

export interface RegisterUserUseCase {
  register: (userDto: UserDto) => Promise<User>;
}
