const express = require("express");


function createEmployeeRouter(dependencies) {
  const router = express.Router();
  const { db } = dependencies;

  // router.use((req, res, next) => {

  // });

  // create table
  router.get("/createEmployee", async (req, res) => {
    try {
      console.log("Inside try");
      const createTable = await db.createTable();
      return res.status(200).send("Table created");
    } catch (error) {
      console.log("Inside catch");
      if (error.code === "ER_TABLE_EXISTS_ERROR") {
        return res.status(400).send("Table already exists!");
      }
      return res.status(500).send("Internal server error");
    }
  });

  // AddEmployee --Register
  router.post("/addEmployee", async (req, res) => {
    // faced weird problem
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

  // login
  router.post("/login", async (req, res) => {
    const { user_name, password } = req.body;

    const user = await db.getUser(user_name);

    console.log("Inside router");
    if (password === user.password) {
      return res.status(200).send("Logged In");
    } else {
      return res.status(400).send("Invalid UserName or Password");
    }
  });

  // get all employee
  router.get("/getEmployee", async (req, res) => {
    try {
      const employees = await db.getAllEmployeesWithoutPassword();
      return res.status(200).send(employees);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });

  // get a employee by id
  router.get("/getEmployee/:id", async (req, res) => {
    try {
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

  // delete employee
  router.delete("/deleteEmployee/:id", async (req, res) => {
    try {
      const id = req.params.id;
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
