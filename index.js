const express = require("express");
const createDatabase = require("./database");
// const configureSession = require('./session');
const configureSession = require('./sessions');
require('dotenv').config()

const createEmployeeRouter = require("./employee-router");

(async function (params) {
  try {
    const db = await createDatabase();
    const app = express();

    app.use(express.json());
    const session = configureSession(app);

    const employeeRouter = createEmployeeRouter({ db, session });

    app.use("/employee", employeeRouter);

    app.listen(process.env.APP_PORT, () => {
      console.log(`Server started on ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();

