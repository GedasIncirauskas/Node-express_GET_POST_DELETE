const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const { port, dbConfig } = require('./config.js');

const app = express();
app.use(express.json());
app.use(cors());

//Get
app.get('/items', async (req, res) => {
  const limit = req.query.limit || '';
  const query = `SELECT * FROM items ${limit && `LIMIT ${limit}`}`;
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err });
  }
});

//Post
app.post('/items', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO items (title)
      VALUES (${mysql.escape(req.body.title)})`,
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err });
  }
});

//Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `DELETE FROM items WHERE id = ${mysql.escape(req.params.id)}`,
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

app.listen(port, () => console.log(`Working on ${port}`));
