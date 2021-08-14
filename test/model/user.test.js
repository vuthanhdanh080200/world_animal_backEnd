const { User } = require("../../model/user");
const {
  deleteAllUser,
  insertUser,
  deleteUserByUserName,
} = require("../../utility/sqlHelper");

describe("create user", () => {
  let user;

  beforeEach(async () => {
    user = {
      username: "12345",
      email: "12345@gmail.com",
      password: "12345",
      avatar: null,
    };

    await insertUser({
      userId: "22E94B25-F14D-41A3-B954-3EAB653F3D7D",
      username: "54321",
      email: "54321@gmail.com",
      password: "12345",
      avatar: null,
    });
  });

  afterEach(async () => {
    await deleteAllUser();
  });

  it("should return error if username is already exist", async () => {
    user.username = "54321";
    await expect(User.create(user)).rejects.toThrow();
  });

  it("should return error if username is empty", async () => {
    user.username = 1234;
    await expect(User.create(user)).rejects.toThrow();
  });

  it("should return userId if valid user", async () => {
    const userId = await User.create(user);
    // debug(userId);
    expect(userId).toBeDefined();
  });
});

describe("get user", () => {
  let user;

  beforeEach(async () => {
    user = {
      userId: "22E94B25-F14D-41A3-B954-3EAB653F3D7D",
      username: "12345",
      email: "12345@gmail.com",
      password: "12345",
      avatar: null,
    };
    await insertUser(user);
  });

  afterEach(async () => {
    await deleteAllUser();
  });

  it("should return error if username is incorrect", async () => {
    const user = await User.getUserByUsername("");
    expect(user).not.toBeDefined();
  });

  it("should return user if valid username", async () => {
    const result = await User.getUserByUsername(user.username);
    expect(result.email).toEqual(user.email);
  });
});

describe("update user", () => {
  let user;

  beforeEach(async () => {
    user = {
      userId: "22E94B25-F14D-41A3-B954-3EAB653F3D7D",
      username: "12345",
      email: "12345@gmail.com",
      password: "12345",
      avatar: null,
    };

    await insertUser({
      userId: user.userId,
      username: "54321",
      email: "54321@gmail.com",
      password: "12345",
      avatar: null,
    });

    await insertUser({
      userId: "973A6F0C-8D9D-44F3-B818-CB8F6D7B2142",
      username: "67890",
      email: "67890@gmail.com",
      password: "12345",
      avatar: null,
    });
  });

  afterEach(async () => {
    await deleteAllUser();
  });

  it("should return error if username is existed", async () => {
    user.username = "67890";
    await expect(User.update(user)).rejects.toThrow();
  });

  it("should return false if userId is invalid", async () => {
    user.userId = "";
    const result = await User.update(user);
    expect(result).toEqual(false);
  });

  it("should return true if userId is valid", async () => {
    const result = await User.update(user);
    expect(result).toEqual(true);
  });
});

// describe("delete user", () => {
//   const userId = "22E94B25-F14D-41A3-B954-3EAB653F3D7D";
//   beforeEach(async () => {
//     await createMssqlRequest().then(async (request) => {
//       await request.query(
//         `INSERT INTO [dbo].[tbUser]
//                 VALUES ('${userId}',
//                     'danh',
//                     'danh@gmail.com',
//                     '12345',
//                     'null')`
//       );
//     });
//   });

//   afterEach(() => sql.close());

//   it("should return true if user deleted success", async () => {
//     const result = await User.delete(userId);
//     expect(result).toEqual(true);
//   });
// });
