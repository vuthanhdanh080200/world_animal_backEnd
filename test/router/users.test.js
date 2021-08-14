const request = require("supertest");
const createMssqlRequest = require("../../utility/sqlHelper");
const sql = require("mssql");
describe("POST /", () => {
  let user;
  let server;

  beforeEach(() => {
    user = {
      username: "12345",
      email: "12345@gmail.com",
      password: "12345",
      avatar: null,
    };
    server = require("../../index");
  });
  afterEach(async () => {
    await createMssqlRequest().then(async (request) => {
      await request
        .query(`DELETE FROM [dbo].[tbUser] WHERE username = '${user.username}'`)
        .then((request) => {
          sql.close();
        });
    });
    await server.close();
  });

  it("should return 400 if invalid user", async () => {
    user = {};
    const res = await request(server).post("/api/users").send(user);
    expect(res.status).toBe(400);
  });

  it("should return user if valid user", async () => {
    const res = await request(server).post("/api/users").send(user);
    expect(res.body).toMatchObject(user);
    expect(res.status).toBe(200);
  });
});

describe("POST /login", () => {
  let user;
  let server;

  beforeEach(async () => {
    user = {
      userId: "22E94B25-F14D-41A3-B954-3EAB653F3D7D",
      username: "54321",
      email: "54321@gmail.com",
      password: "54321",
      avatar: null,
    };
    await createMssqlRequest().then(async (request) => {
      await request.query(
        `INSERT INTO [dbo].[tbUser]
            VALUES ('${user.userId}',
                '${user.username}',
                '${user.email}',
                '${user.password}',
                '${user.avatar}')`
      );
    });
    server = require("../../index");
  });
  afterEach(async () => {
    await createMssqlRequest().then(async (request) => {
      await request
        .query(
          `DELETE FROM [dbo].[tbUser] WHERE userId = '22E94B25-F14D-41A3-B954-3EAB653F3D7D'`
        )
        .then((request) => {
          sql.close();
        });
    });
    await server.close();
  });

  it("should return user if username and password is correct", async () => {
    const res = await request(server)
      .post("/api/users/login")
      .send({ username: user.username, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "password", "userId", "username");
  });

  it("should return 400 if username is incorrect", async () => {
    user.username = "";
    const res = await request(server)
      .post("/api/users/login")
      .send({ username: user.username, password: user.password });
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is incorrect", async () => {
    user.password = "";
    const res = await request(server)
      .post("/api/users/login")
      .send({ username: user.username, password: user.password });
    expect(res.status).toBe(400);
  });
});

describe("PUT /:userId", () => {
  let userId;
  let user;
  let server;

  beforeEach(async () => {
    userId = "22E94B25-F14D-41A3-B954-3EAB653F3D7D";
    user = {
      username: "12345",
      email: "12345@gmail.com",
      password: "12345",
      avatar: null,
    };
    await createMssqlRequest().then(async (request) => {
      await request.query(
        `INSERT INTO [dbo].[tbUser]
            VALUES ('${userId}',
                '${user.username}',
                '${user.email}',
                '${user.password}',
                '${user.avatar}')`
      );
    });
    server = require("../../index");
  });
  afterEach(async () => {
    await createMssqlRequest().then(async (request) => {
      await request
        .query(
          `DELETE FROM [dbo].[tbUser] WHERE userId = '22E94B25-F14D-41A3-B954-3EAB653F3D7D'`
        )
        .then((request) => {
          sql.close();
        });
    });
    await server.close();
  });

  it("should return 400 if invalid userId", async () => {
    userId = "1";
    const res = await request(server).put(`/api/users/${userId}`).send(user);
    expect(res.status).toBe(400);
  });

  it("should return user if valid userId", async () => {
    const res = await request(server).put(`/api/users/${userId}`).send(user);
    expect(res.status).toBe(200);
    expect(res.body).toBe(true);
  });
});
