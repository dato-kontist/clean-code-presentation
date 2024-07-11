import { User } from "../core";

export class GoodUserExample extends User {
  constructor(user: User) {
    super(user.id, user.name, user.email);
  }

  validate() {
    const errors: string[] = [];
    // Imagine I used a framework like zod to validate the user instead of if chain
    if (!this.name) {
      errors.push(`Missing name, received: ${this.name}`);
    }
    if (!this.email) {
      errors.push(`Missing email, received: ${this.email}`);
    }

    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  }
}
