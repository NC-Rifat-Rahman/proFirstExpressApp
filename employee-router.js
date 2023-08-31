const express = require("express");
// const session = require("express-session");
const session = require("./session");
const bcrypt = require("bcryptjs");

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

function createEmployeeRouter(dependencies) {
  const router = express.Router();

  const { db, session } = dependencies;

   // ----------------------//
  function isCorrectPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  function updateUserLoginSession(req, user) {
    session.setUserLogin(req);
    session.setUserRole(req, user.user_role);
    session.setUserId(req, user.id);
  }
     // ----------------------//

  // login
  router.post("/login", async (req, res) => {
    const { id } = req.params;
    const { user_name, user_role } = req.body;

    const user = await db.getUser(user_name);
    // console.log(user);
    let userId = req.session.currentUserId;
    userId = user.id;
    // console.log({userId});

    if (isCorrectPassword(user, req.body.password)) {
      updateUserLoginSession(req, user);

      return res.status(200).send(`${user.user_role} Logged In`);
    } else {
      return res.status(400).send("Invalid UserName or Password");
    }
  });

  // get current user
  router.get("/getCurrentEmployee", async (req, res) => {
    try {
      const currentEmployeeId = session.getUserId(req);
      console.log({currentEmployeeId});
      const employee = await db.getAEmployeeById(currentEmployeeId);
      return res.status(200).send(employee);

      // if(session.setUserLogin(req)){

      //   return res.status(200).send("OKAY");
      // }
      return res.status(400).send("No employee found");
    } catch (error) {
      console.error(error);
  
      // if (error === "EMPLOYEE_NOT_FOUND") {
      //   return res.status(400).send("No employee found");
      // }
  
      return res.status(500).send("Internal Server Error");
    }
  });

  // logout
  router.delete("/logout", (req, res) => {
    req.session.destroy();
    res.send("logout");
  });

  // // middleware to check if user is loggedin to access pages
  // router.use((req, res, next) => {
  //   if (session.isUserLoggedIn) {
  //     console.log("User loged in");
  //     //console.log(results);
  //     next();
  //   }
  //   else if(session.isAdminLoggedin){
  //     console.log("Admin loged in");
  //     next();
  //   }
  //   else {
  //     console.log("Forbidden access");
  //     return res.status(403).send("Forbidden access");
  //   }
  // });

  // to authorize access
  function isAdmin(req) {
    const { user_role } = req.body;
    const a = session.setUserRole(req, user_role);
    console.log(a);

    const x = session.isAdminLoggedIn(req);
    console.log({ x });
    if (x) {
      return true;
    } else {
      return false;
    }
  }
  // router.use((req, res, next) => {

  // });

  // create table
  router.get("/createEmployee", async (req, res) => {
    try {
      if (!session.isAdminLoggedin) {
        return res.status(403).send("Forbidden access");
      }
      const createTable = await db.createTable();
      return res.status(200).send("Table created");
    } catch (error) {
      if (error.code === "ER_TABLE_EXISTS_ERROR") {
        return res.status(400).send("Table already exists!");
      }
      return res.status(500).send("Internal server error");
    }
  });

  // Register
  router.post("/register", async (req, res) => {
    // faced weird problem
    try {
      const { user_name, password, user_role, designation } = req.body;

      const employeeId = await db.userRegister(
        user_name,
        password,
        user_role,
        designation
      );
      return res.status(200).send({ message: "Register Successfull!", employeeId });
    } catch (error) {
      console.error(error);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).send("USER ID EXISTS");
      }
      return res.status(500).send("Internal Server Error");
    }
  });

  // addEmployee
  router.post("/addEmployee", async (req, res) => {
    // faced weird problem
    try {
      if (!session.isAdminLoggedIn(req)) {
        return res.status(403).send("Forbidden access");
      }
      const { user_name, user_role, designation } = req.body;

      const employeeId = await db.addEmployee(
        user_name,
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
  // dashboard
  router.get("/dashboard", (req, res) => {

    console.log(req.session);
    console.log(!session.isAdminLoggedIn(req));

    if (!session.isAdminLoggedIn(req)) {
      return res.status(403).send("Forbidden access");
    }
    return res.status(200).send("OKAY");
  });

  // get all employee
  router.get("/getEmployee", async (req, res) => {
    
    try {
      if (!session.isAdminLoggedIn(req)) {
        return res.status(403).send("Forbidden access");
      }
     
        const employees = await db.getAllEmployeesWithoutPassword();
        return res.status(201).send(employees);
      
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });


  // get a employee by id
  router.get("/getEmployee/:id", async (req, res) => {
    try {
      if (!session.isAdminLoggedIn(req)) {
        return res.status(403).send("Forbidden access");
      }

      const id = req.params.id;
      const employee = await db.getAEmployeeById(id);

      if (employee === undefined) {
        throw "EMPLOYEE_NOT_FOUND";
      }
      return res.status(200).send(employee);
    } catch (error) {
      console.error(error);

      if (error === "EMPLOYEE_NOT_FOUND") {
        return res.status(400).send("No employee found");
      }

      return res.status(500).send("Internal Server Error");
    }
  });

  // update employee
  router.put("/updateEmployee/:id", async (req, res) => {
    try {
      if (!session.isAdminLoggedIn(req)) {
        return res.status(403).send("Forbidden access");
      }
      const { id } = req.params;
      const { user_name, designation } = req.body;

      const updateEmployee = await db.updateEmployee(
        user_name,
        designation,
        id
      );

      if (updateEmployee.affectedRows === 0) {
        throw "Id_not_found";
      }
      return res.status(201).send("Employee Updated");
    } catch (error) {
      console.error(error);

      if (error === "Id_not_found") {
        return res.status(400).send("User does not exist!");
      }
      return res.status(500).send("Internal Server Error");
    }
  });

    // update password
    router.put("/updateEmployeePassword/:id", async (req, res) => {
      try {

        const { id } = req.params;
        const { password } = req.body;
        bcrypt.compareSync(req.body.password,password);
  
        const updateEmployee = await db.updateEmployeePassword(
          password,
          id
        );
  
        if (updateEmployee.affectedRows === 0) {
          throw "Id_not_found";
        }
        return res.status(201).send("Employee Password Updated");
      } catch (error) {
        console.error(error);
  
        if (error === "Id_not_found") {
          return res.status(400).send("User does not exist!");
        }
        return res.status(500).send("Internal Server Error");
      }
    });

  // delete employee
  router.delete("/deleteEmployee/:id", async (req, res) => {
    try {
      if (!session.isAdminLoggedIn(req)) {
        return res.status(403).send("Forbidden access");
      }
      const id = req.params.id;
      const employeeDetails = await db.getAEmployeeById(id)

      if(employeeDetails.user_role === "admin"){
        return res.status(400).send("Admins cannot be deleted!")
      }

      const deleteEmployee = await db.deleteEmployee(id);

      if (deleteEmployee.affectedRows === 0) {
        throw "Id_not_found";
      }
      return res.status(200).send("Employee Deleted");
    } catch (error) {
      if (error === "Id_not_found") {
        return res.status(400).send("User does not exist!");
      }
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });

  router.get("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
  });

  router.post("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
  });

  router.put("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
  });

  router.delete("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
  });

  return router;
}

module.exports = createEmployeeRouter;
