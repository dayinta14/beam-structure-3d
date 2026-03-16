const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Beamstructureviewer",
  password: "dayinta14",
  port: 5432,
});

module.exports = pool;