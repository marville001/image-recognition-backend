const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
//
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Heroku db
const db = knex({
  client: "pg",
  connection: {
    connectString: process.env.DATABASE_URL,
    ssl: true
  }
});

// local db
// const db = knex({
//   client: "postgres",
//   connection: {
//     host: "127.0.0.1",
//     user: "postgres",
//     password: "postGress@1904???",
//     database: "smart-brain"
//   }
// });

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then(users => res.send(users));
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
