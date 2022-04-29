const { Pool } = require("pg");

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "e_commerce",
  password: "123",
  port: 5432,
});

module.exports = db;
