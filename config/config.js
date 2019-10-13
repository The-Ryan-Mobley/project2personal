module.exports = {
  development: {
    username: "root",
    password: process.env.sqlPassword,
    database: "project",
    host: "localhost",
    dialect: "mysql"
  },
  production: {
    use_env_variable: "JAWSDB_URL",
    dialect: "mysql"
  }
};
