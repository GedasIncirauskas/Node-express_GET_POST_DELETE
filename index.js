const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASS,
  port: process.env.MYSQL_PORT,
};

//Check server is working

app.get('/', (req, res) => {
  return res.send({ msg: 'Server is running' });
});

//Get shirts
app.get('/shirts', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT * FROM shirts ORDER BY price ASC LIMIT 10`,
    );
    await con.end();

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err });
  }
});

//ASC shirts
app.get('/shirts/:size', async (req, res) => {
  const size = req.params.size.toLocaleLowerCase();
  const limit = req.query.limit;
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT * FROM shirts WHERE size = '${size}' ORDER BY price ASC LIMIT ${limit}`,
    );
    await con.end();

    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err });
  }
});

//Post shirts
app.post('/shirts', async (req, res) => {
  if (!req.body.brand || !req.body.model || !req.body.size || !req.body.price) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO shirts (brand, model, size, price)
      
      VALUES ('${req.body.brand}', '${req.body.model}', '${req.body.size}', '${req.body.price}')`,
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err });
  }
});

app.all('*', (req, res) => {
  return res.status(400).send({ msg: 'Bad url entered!' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Working on ${port}`));
