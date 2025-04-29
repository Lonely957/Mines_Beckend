// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       // normalmente "postgres"
  host: "localhost",
  database: "Mines_Master",  // nome que você criou
  password: "Admin",     // a senha que você configurou no PostgreSQL
  port: 5432,
});

module.exports = pool;
