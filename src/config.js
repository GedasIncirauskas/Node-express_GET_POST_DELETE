module.exports = {
  port: process.env.PORT,
  dbConfig: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASS,
    port: process.env.MYSQL_PORT,
  },
};
