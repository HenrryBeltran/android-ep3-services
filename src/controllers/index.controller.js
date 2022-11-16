const { response } = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "containers-us-west-106.railway.app",
  password: "tc6kn9W61183eshM1LX6",
  database: "railway",
  port: "7974",
});

const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.status(200).json(response.rows);
};

const getUserById = async (req, res) => {
  const id = parseInt(req.query.id);
  const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
};

const getLoginAuthentication = async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  const responseOne = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const responseTwo = await pool.query("SELECT * FROM users WHERE password = $1", [password]);

  await Promise.all([responseOne, responseTwo])
    .then((response) => {
      const responseEmail = response[0];
      const responsePassword = response[1];

      if (responseEmail.rowCount <= 0) {
        res.json({ message: "Este correo no esta registrado" });
        return;
      }
      if (responsePassword.rowCount <= 0) {
        res.json({ message: "Contraseña incorrecta" });
        return;
      }
      res.json({ message: "0" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ reason: "unknown" });
    });
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const response = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [
    name,
    email,
    password,
  ]);
  res.json({
    message: "User Added successfully",
    body: {
      user: { name, email, password },
    },
  });
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.query.id);
  await pool.query("DELETE FROM users where id = $1", [id]);
  res.json(`User ${id} deleted Successfully`);
};

module.exports = {
  getUsers,
  getUserById,
  getLoginAuthentication,
  createUser,
  deleteUser,
};