const sql = require("mssql");
const config = require("../config/dbConfig");
async function createMssqlRequest() {
  try {
    const pool = await sql.connect(config);
    const request = await pool.request();
    return request;
  } catch (err) {
    console.error(new Error(err));
  }
}

async function insertUser(user) {
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
}

async function deleteUserByUserName(userName) {
  await createMssqlRequest().then(async (request) => {
    await request
      .query(`DELETE FROM [dbo].[tbUser] WHERE username = '${userName}'`)
      .then(() => {
        sql.close();
      });
  });
}

async function deleteAllUser() {
  await createMssqlRequest().then(async (request) => {
    await request.query(`DELETE FROM [dbo].[tbUser]`).then(() => {
      sql.close();
    });
  });
}

module.exports = {
  createMssqlRequest,
  insertUser,
  deleteUserByUserName,
  deleteAllUser,
};
