import {
  AlreadyExistingUserError,
  InvalidUserAttributeError,
  User,
} from "../core";
import { UserRepository } from "./UserRepository";
import { EmailSender } from "./EmailSender";

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private emailSender: EmailSender
  ) {}
  public async execute(user: User): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new AlreadyExistingUserError("User already exists");
    }
    if (!user.name || !user.email) {
      throw new InvalidUserAttributeError("Invalid user");
    }
    const createdUser = await this.userRepository.create(user);
    await this.emailSender.sendEmail(user.email);
    return createdUser;
  }
}
