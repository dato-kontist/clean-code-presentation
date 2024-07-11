import { GoodUserExample } from "./GoodUserExample";
import { User } from "../core";

describe("GoodUserExample", () => {
  it("should create an instance of GoodUserExample", () => {
    const user = new User("1", "John Doe", "john.doe@example.com");
    const goodUser = new GoodUserExample(user);
    expect(goodUser).toBeInstanceOf(GoodUserExample);
  });

  it("should validate successfully with valid user data", () => {
    const user = new User("1", "John Doe", "john.doe@example.com");
    const goodUser = new GoodUserExample(user);
    expect(() => goodUser.validate()).not.toThrow();
  });

  it("should throw an error if name is missing", () => {
    const user = new User("1", "", "john.doe@example.com");
    const goodUser = new GoodUserExample(user);
    expect(() => goodUser.validate()).toThrow("Missing name, received: ");
  });

  it("should throw an error if email is missing", () => {
    const user = new User("1", "John Doe", "");
    const goodUser = new GoodUserExample(user);
    expect(() => goodUser.validate()).toThrow("Missing email, received: ");
  });

  it("should throw an error if both name and email are missing", () => {
    const user = new User("1", "", "");
    const goodUser = new GoodUserExample(user);
    expect(() => goodUser.validate()).toThrow(
      "Missing name, received: ; Missing email, received: "
    );
  });
});
