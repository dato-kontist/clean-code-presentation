import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { User as UserCore } from "../../core";
import { GoodUserExample as User } from "../GoodUserExample";

describe("InMemoryUserRepository", () => {
  let userRepository: ReturnType<typeof InMemoryUserRepository>;
  let testUser: User;

  beforeEach(() => {
    userRepository = InMemoryUserRepository();
    testUser = new User(new UserCore("1", "Test User", "test@example.com"));
  });

  it("should create a user", async () => {
    const createdUser = await userRepository.create(testUser);
    expect(createdUser).toEqual(testUser);
  });

  it("should find a user by email", async () => {
    await userRepository.create(testUser);
    const foundUser = await userRepository.findByEmail(testUser.email);
    expect(foundUser).toEqual(testUser);
  });

  it("should return null if user is not found by email", async () => {
    const foundUser = await userRepository.findByEmail(
      "nonexistent@example.com"
    );
    expect(foundUser).toBeNull();
  });
});
