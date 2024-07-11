import {
  AlreadyExistingUserError,
  EmailSendingError,
  InvalidUserAttributeError,
  User as UserDto,
  UserRegistrationError,
} from "../core";
import { GoodUserExample as User } from "./GoodUserExample";
import {
  EmailSenderPort,
  RegisterUserUseCase,
  UserRepositoryPort,
} from "./ports";

export const registerUserUseCase = (
  userRepository: UserRepositoryPort,
  emailAdapter: EmailSenderPort
): RegisterUserUseCase => {
  const register = async (userDto: UserDto): Promise<User> => {
    const user = new User({ ...userDto });

    const errors: UserRegistrationError[] = await validateUser({
      user,
      userRepository,
    });
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    try {
      const createdUser = await userRepository.create(user);
      await emailAdapter.sendEmail(user.email);
      return createdUser;
    } catch (error) {
      if (error instanceof EmailSendingError) {
        throw new Error(
          "Customer is registered, but failed to send email. " + error.message
        );
        // add handlers for this scenario
      }
      throw new Error("Unexpected creation error");
    }
  };

  return { register };
};

type ValidateUserParams = {
  user: User;
  userRepository: UserRepositoryPort;
};
async function validateUser({
  user,
  userRepository,
}: ValidateUserParams): Promise<UserRegistrationError[]> {
  const errors: UserRegistrationError[] = [];

  const attributesValidationResult = validateUserAttributes({ user });
  if (attributesValidationResult instanceof InvalidUserAttributeError) {
    errors.push(attributesValidationResult);
  }

  const uniquenessValidationResult = await validateUserUniqueness({
    userRepository,
    userEmail: user.email,
  });
  if (uniquenessValidationResult instanceof AlreadyExistingUserError) {
    errors.push(uniquenessValidationResult);
  }

  return errors;
}

type ValidateUserUniquenessParams = {
  userRepository: UserRepositoryPort;
  userEmail: string;
};
async function validateUserUniqueness({
  userRepository,
  userEmail,
}: ValidateUserUniquenessParams): Promise<void | AlreadyExistingUserError> {
  const user = await userRepository.findByEmail(userEmail);
  if (user) {
    return new AlreadyExistingUserError("User already exists");
  }
  return undefined;
}

type ValidateUserAttributesParams = {
  user: User;
};
function validateUserAttributes({
  user,
}: ValidateUserAttributesParams): void | InvalidUserAttributeError {
  try {
    user.validate();
    return undefined;
  } catch (error) {
    return new InvalidUserAttributeError(
      "Invalid user. Please check the errors: " + (error as Error).message
    );
  }
}
