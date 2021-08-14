module.exports = {
  user: "sa",
  password: "123456789",
  database: "world_animal",
  server: "192.168.1.81",
  port: 1433,
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
