module.exports = {
  user: "danh",
  password: "123456abcABC",
  database: "world_animal_test",
  server: "mssql-44725-0.cloudclusters.net",
  port: 19777,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
