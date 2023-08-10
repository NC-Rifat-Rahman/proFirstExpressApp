const express = require("express");
const app = express();
const mysql = require("mysql2-promise")();
const session = require("express-session");

app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

const db = function createDatabase() {
  try {
    mysql.configure({
      host: "localhost",
      user: "root",
      password: "password",
      database: "office",
    });

    //login
    return {
      getUserNameAndPassword: async function (user_name, password) {
        // console.log("Inside database");
        //const [rows] = await mysql.execute('SELECT * FROM employee WHERE user_name = ? AND password = ?', [user_name, password]);

        const sql = await mysql.execute(
          "SELECT * FROM employee WHERE user_name = ? AND password = ?",
          [user_name, password]
        );
        // console.log(sql);
        const query = db.query(sql, [user_name, password], (err, results) => {
          console.log("asd");
          if (err) {
            console.log(err);
            res.status(500).send("Internal server error");
          }
          //console.log({results});
          const fetchUserRole = results[0].user_role;

          if (results.length !== 0 && fetchUserRole === "user") {
            console.log("User Login Successfull");
            req.session.isLoggedIn = true;
            req.session.userRole = results[0].user_role;

            return res.status(200).send("User LoggedIn");
          } else if (results.length !== 0 && fetchUserRole === "admin") {
            console.log("Admin Login Successfull");
            req.session.isLoggedIn = true;
            req.session.userRole = results[0].user_role;

            return res.status(200).send("Admin LoggedIn");
          } else {
            console.log("Wrong info");

            return res.status(403).send("Invalid Username or password");
          }
        });

        return rows[0];
      },
    };
  } catch (error) {
    console.error(error);
  }
};

module.exports = db;
