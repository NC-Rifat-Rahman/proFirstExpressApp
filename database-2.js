const mysql = require("mysql2/promise");

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "office",
  });

  const [rows] = await connection.execute("SELECT id FROM employee");
  console.log(rows);


  connection.end();
}

// const query = db.query(sql, [user_name, password], (err, results) => {
//   if (err) {
//     console.log(err);
//     res.status(500).send("Internal server error");
//   }
//   //console.log({results});
//   const fetchUserRole = results[0].user_role;

//   if (results.length !== 0 && fetchUserRole === "user") {
//     console.log("User Login Successfull");
//     req.session.isLoggedIn = true;
//     req.session.userRole = results[0].user_role;

//     return res.status(200).send("User LoggedIn");
//   } else if (results.length !== 0 && fetchUserRole === "admin") {
//     console.log("Admin Login Successfull");
//     req.session.isLoggedIn = true;
//     req.session.userRole = results[0].user_role;

//     return res.status(200).send("Admin LoggedIn");
//   } else {
//     console.log("Wrong info");

//     return res.status(403).send("Invalid Username or password");
//   }
// });
