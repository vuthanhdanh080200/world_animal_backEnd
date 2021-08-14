const { validate } = require("../../../model/user");

describe("validateUser", () => {
  let user;
  beforeEach(() => {
    user = {
      username: "12345",
      email: "12345@gmail.com",
      password: "12345",
      avatar: null,
    };
  });
  test("should return err if username is incorrect", () => {
    user.username = "";
    const { value, error } = validate(user);
    expect(error).toBeDefined();
  });

  test("should return val if user is correct", () => {
    const { value } = validate(user);
    expect(value).toMatchObject(user);
  });
});
