const express = require("express");
const createDatabase = require("./database");
const apiErrorHandler = require("./api-error-handler");
const ApiError = require("./ApiError");

(async function (params) {
  try {
    const db = await createDatabase();
    const app = express();

    app.use(express.json());

    // error handling middleware
    app.use(function (err, req, res, next) {
      res.status(500).send("Something went wrong!");
    });

    // create table
    app.get("/createEmployee", (req, res, next) => {
      try {
        const createTable = db.createTable();
        console.log(createTable);
        return res.status(200).send("Table created");
        
      } catch (error) {
        console.log(error);
      }

      /*
      try {
        
        const createTable = db.createTable();

        // try {
        //   const id = req.params.id;
        //   const employee = await db.getAEmployeeById(id);
  
        //   if(employee === undefined) {
        //     throw 'EMPLOYEE_NOT_FOUND';
        //   }
  
        //   return res.send(employee);
        // } catch (error) {
        //   console.error(error);
  
        //   if(error === 'EMPLOYEE_NOT_FOUND') {
        //     return res.status(400).send('No employee found')
        //   }
  
        //   return res.status(500).send("Internal Server Error");
        // }
        const e = new EvalError("hello");
        console.log({message: e.name});

        
        return res.status(200).send("Table Created");
      } 
      catch (error) {
        
        console.error(error);
        console.log("Inside catch");
        
        return res.status(500).send("Internal Server Error");
      }
      */
    });
    // AddEmployee --Register
    app.post("/addEmployee", async (req, res) => {
      try {
        const { user_name, password, user_role, designation } = req.body;

        const employeeId = await db.userRegister(
          user_name,
          password,
          user_role,
          designation
        );

        return res.status(200).send({ message: "Employee Added", employeeId });
      } catch (error) {
        console.error(error);
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).send("USER ID EXISTS");
        }
        return res.status(500).send("Internal Server Error");
      }
    });

    // //login
    app.post("/login", async (req, res) => {
      const { user_name, password } = req.body;

      const user = await db.getUser(user_name);

      if (password === user.password) {
        return res.status(200).send("Logged In");
      } else {
        return res.status(403).send("Invalid UserName or Password");
      }
    });

    //get All Employee
    app.get("/getEmployee", async (req, res) => {
      try {
        const employees = await db.getAllEmployeesWithoutPassword();

        return res.send(employees);
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
    });

    // get a employee by id
    app.get("/getEmployee/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const employee = await db.getAEmployeeById(id);

        if (employee === undefined) {
          throw "EMPLOYEE_NOT_FOUND";
        }

        return res.send(employee);
      } catch (error) {
        console.error(error);

        if (error === "EMPLOYEE_NOT_FOUND") {
          return res.status(400).send("No employee found");
        }

        return res.status(500).send("Internal Server Error");
      }
    });

    // update employee
    app.put("/updateEmployee/:id", async (req, res) => {
      const { id } = req.params;
      const { user_name, designation } = req.body;

      try {
        const updateEmployee = await db.updateEmployee(
          user_name,
          designation,
          id
        );

        console.log(req.body);

        return res.send("Employee Updated");
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
    });

    // delete employee
    app.delete("/deleteEmployee/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const deleteEmployee = await db.deleteEmployee(id);
        return res.status(400).send("Employee Deleted");
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
    });
    app.listen("5000", () => {
      console.log("Server Started on port 5000");
    });
  } catch (error) {
    console.error(error);
  }
})();

// const session = require("express-session");

// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // Create database
// app.get("/createdb", (req, res) => {
//   let sql = "CREATE DATABASE office";

//   db.query(sql, (err) => {
//     if (err) {
//       throw err;
//     }
//     res.send("Database created");
//   });
// });

// // create table
// app.get("/createEmployee", (req, res) => {
//   console.log(results);
//   let sql =
//     "CREATE TABLE employee (id int AUTO_INCREMENT NOT NULL, user_name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, user_role VARCHAR(40) NOT NULL, designation VARCHAR(255) NOT NULL, PRIMARY KEY(id) )";

//   db.query(sql, (err) => {
//     if (err) {
//       throw err;
//     }
//     res.send("Employee table created.");
//   });
// });

// // to authorize access
// function isAdmin(req) {
//   return req.session.userRole === "admin";
// }

// // add Employye // Register
// app.post("/addEmployee", (req, res) => {
//   if (!isAdmin(req)) {
//     return res.status(403).send("UNAUTHORIZED");
//   }

//   const id = req.body.id;
//   const user_name = req.body.user_name;
//   const password = req.body.password;
//   const user_role = req.body.user_role;
//   const designation = req.body.designation;

//   const sql = "INSERT INTO employee values(?,?,?,?,?)";

//   const query = db.query(
//     sql,
//     [id, user_name, password, user_role, designation],
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return res.send("Internatl server error");
//       } else {
//         return res.send("Employee added Successfully");
//       }
//     }
//   );
// });

// //login
// app.post("/login", (req, res) => {
//   const { user_name, password } = req.body;

//   db().getUserNameAndPassword(user_name, password);
//   return res.status(200).send("Admin LoggedIn");
// });

// /*
// // login
// app.post("/login", (req, res) => {
//     const user_name = req.body.user_name;
//     const password = req.body.password;

//     const sql = 'SELECT * FROM employee WHERE user_name = ? AND password = ?';

//     const query = db.query(sql, [user_name, password], (err, results) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send("Internal server error");
//         }
//         //console.log({results});
//         const fetchUserRole = results[0].user_role;

//         if (results.length !== 0 && fetchUserRole === "user") {
//             console.log("User Login Successfull");
//             req.session.isLoggedIn = true;
//             req.session.userRole = results[0].user_role;

//             return res.status(200).send("User LoggedIn");
//         }
//         else if (results.length !== 0 && fetchUserRole === "admin") {
//             console.log("Admin Login Successfull");
//             req.session.isLoggedIn = true;
//             req.session.userRole = results[0].user_role;

//             return res.status(200).send("Admin LoggedIn");
//         }
//         else {
//             console.log("Wrong info");

//             return res.status(403).send("Invalid Username or password");
//         }
//     });

// })
// */

// //logout
// app.delete("/logout", (req, res) => {
//   req.session.destroy();
//   res.send("logout");
// });

// // middleware to check if user is loggedin to access pages
// app.use((req, res, next) => {
//   if (req.session.isLoggedIn) {
//     console.log("User loged in");
//     //console.log(results);
//     next();
//   } else {
//     console.log("Forbidden access");
//     return res.status(403).send("Forbidden access");
//   }
// });

// // dashboard
// app.get("/dashboard", (req, res) => {
//   return res.status(200).send("dashboard");
// });

// // select employees
// app.get("/getEmployee", (req, res) => {
//   if (!isAdmin(req)) {
//     return res.status(403).send("UNAUTHORIZED");
//   }
//   const sql = "SELECT * FROM employee";

//   const query = db.query(sql, (err, results) => {
//     if (err) throw err;
//     //console.log(results);
//     res.send("Employee details fetched");
//   });
// });

// // select particular employee
// app.get("/getEmployee/:id", (req, res) => {
//   if (!isAdmin(req)) {
//     return res.status(403).send("UNAUTHORIZED");
//   }
//   const fetchId = req.params.id;
//   const sql = "SELECT * FROM employee WHERE id=?";

//   const query = db.query(sql, fetchId, (err, results) => {
//     if (err) throw err;

//     //console.log(results);
//     res.send("Employee details fetched by id");
//   });
// });

// // update
// app.put("/updateEmployee/:id", (req, res) => {
//   if (!isAdmin(req)) {
//     return res.status(403).send("UNAUTHORIZED");
//   }
//   const id = req.params.id;
//   const user_name = req.body.user_name;
//   const designation = req.body.designation;

//   const sql = "UPDATE employee SET user_name=?, designation=? WHERE id=?";

//   const query = db.query(sql, [user_name, designation, id], (err, results) => {
//     if (err) throw err;

//     //console.log(results);
//     res.send("Employee details updated");
//   });
// });

// //delete
// app.delete("/deleteEmployee/:id", (req, res) => {
//   if (!isAdmin(req)) {
//     return res.status(403).send("UNAUTHORIZED");
//   }
//   let sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
//   let query = db.query(sql, (err) => {
//     if (err) throw err;
//     res.send("Employee deleted");
//   });
// });

// // create table for project
// app.get("/createProject", (req, res) => {
//   let sql =
//     "CREATE TABLE projects (id int AUTO_INCREMENT, name VARCHAR(255), employee_id int, PRIMARY KEY(id), FOREIGN KEY(employee_id) REFERENCES employee(id))";

//   db.query(sql, (err) => {
//     if (err) {
//       throw err;
//     }
//     res.send("Projects table created.");
//   });
// });

// // add projects
// app.post("/addProjects", (req, res) => {
//   const id = req.body.id;
//   const name = req.body.name;
//   const employee_id = req.body.employee_id;

//   const sql = "INSERT INTO projects values(?,?,?)";

//   const query = db.query(sql, [id, name, employee_id], (err, results) => {
//     if (err) console.log(err);
//     else res.send("OKAY");
//   });
// });

// app.listen("5000", () => {
//   console.log("Server Started on port 5000");
// });
