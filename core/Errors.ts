export class InvalidUserAttributeError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class AlreadyExistingUserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class EmailSendingError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type UserRegistrationError =
  | InvalidUserAttributeError
  | AlreadyExistingUserError;
