import { EmailSender } from "./EmailSender";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { User } from "../core";
import { UserRepository } from "./UserRepository";

describe("RegisterUserUseCase", () => {
  it("should be able to register a valid new user", async () => {
    const useCase = new RegisterUserUseCase(
      new UserRepository(),
      new EmailSender()
    );
    const newUser = new User("1", "John Doe", "john.doe@example.com");
    await expect(useCase.execute(newUser)).resolves.not.toThrow();
  });
  it("should NOT register an invalid user", async () => {
    const alreadyExistingUser = new User(
      "1",
      "John Doe",
      "john.doe@example.com"
    );
    const repositoryUsers = [alreadyExistingUser];
    const useCase = new RegisterUserUseCase(
      new UserRepository(repositoryUsers),
      new EmailSender()
    );
    await expect(useCase.execute(alreadyExistingUser)).rejects.toThrow();
  });
});
