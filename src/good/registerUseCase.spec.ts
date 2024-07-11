import { registerUserUseCase } from "./registerUserUseCase";
import { InMemoryUserRepository } from "./adapters/InMemoryUserRepository";
import {
  BestProviderEmailAdapter,
  CheapProviderEmailAdapter,
} from "./adapters";
import { User as UserDto, EmailSendingError } from "../core";
import { GoodUserExample as User } from "./GoodUserExample";
import {
  EmailSenderPort,
  RegisterUserUseCase,
  UserRepositoryPort,
} from "./ports";

describe("registerUserUseCase", () => {
  let userRepository: UserRepositoryPort;
  let emailAdapter: EmailSenderPort;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = InMemoryUserRepository();
    emailAdapter = BestProviderEmailAdapter();
    useCase = registerUserUseCase(userRepository, emailAdapter);
  });

  it("should register a valid new user", async () => {
    const newUser = new UserDto("1", "John Doe", "john.doe@example.com");
    const createSpy = jest.spyOn(userRepository, "create");
    const sendEmailSpy = jest.spyOn(emailAdapter, "sendEmail");

    await expect(useCase.register(newUser)).resolves.not.toThrow();

    expect(createSpy).toHaveBeenCalledWith(expect.any(User));
    expect(sendEmailSpy).toHaveBeenCalledWith(newUser.email);
  });

  it("should NOT register an already existing user", async () => {
    const existingUser = new UserDto("1", "John Doe", "john.doe@example.com");
    await userRepository.create(new User(existingUser));
    const findByEmailSpy = jest.spyOn(userRepository, "findByEmail");

    await expect(useCase.register(existingUser)).rejects.toThrow(
      "Error: User already exists"
    );
    expect(findByEmailSpy).toHaveBeenCalledWith(existingUser.email);
  });

  it("should NOT register a user with invalid attributes", async () => {
    const invalidUser = new UserDto("1", "", "john.doe@example.com");
    const validateSpy = jest.spyOn(User.prototype, "validate");

    await expect(useCase.register(invalidUser)).rejects.toThrow(
      "Error: Invalid user. Please check the errors: Missing name, received: "
    );

    expect(validateSpy).toHaveBeenCalled();
  });

  it("should handle email sending failure", async () => {
    emailAdapter = CheapProviderEmailAdapter();
    const sendEmailSpy = jest.spyOn(emailAdapter, "sendEmail");
    sendEmailSpy.mockRejectedValue(
      new EmailSendingError("Failed to send email")
    );

    useCase = registerUserUseCase(userRepository, emailAdapter);
    const newUser = new UserDto("1", "John Doe", "john.doe@example.com");
    const createSpy = jest.spyOn(userRepository, "create");

    await expect(useCase.register(newUser)).rejects.toThrow(
      "Customer is registered, but failed to send email. Failed to send email"
    );

    expect(createSpy).toHaveBeenCalledWith(expect.any(User));
    expect(sendEmailSpy).toHaveBeenCalledWith(newUser.email);
  });
});
