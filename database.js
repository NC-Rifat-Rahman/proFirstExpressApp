const mysql = require("mysql2/promise");
const express = require("express");
const bcrypt = require ("bcryptjs")
const Caching = require("./cache");

require('dotenv').config()
const app = express();

module.exports = async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  const createCache = Caching();
  // const NodeCache = require( "node-cache" );
  // const myCache = new NodeCache();

  return {
    //create table
    createTable: async function () {
      let sql =
        "CREATE TABLE employee (id int AUTO_INCREMENT NOT NULL, user_name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, user_role VARCHAR(40) NOT NULL, designation VARCHAR(255) NOT NULL, PRIMARY KEY(id) )";
        
      const [response] = await connection.execute(sql);
      return response.serverStatus;
    },

    //Register
    userRegister: async function (user_name, password, user_role, designation) {
      var salt = bcrypt.genSaltSync(parseInt(process.env.DB_CONSTANT));
      const hashedPassword = bcrypt.hashSync(password,salt);

      const sql =
        "INSERT INTO employee(user_name, password, user_role, designation) values(?,?,?,?)";

      const [resp] = await connection.execute(sql, [
        user_name,
        hashedPassword,
        user_role,
        designation,
      ]);

      return resp.insertId;
    },

    // addEmployee
    addEmployee: async function (user_name, user_role, designation) {

      const defaultPassword = process.env.DB_DEFAULT_PASSWORD;  
      const sql =
        "INSERT INTO employee(user_name, password, user_role, designation) values(?,?,?,?)";

      const [resp] = await connection.execute(sql, [
        user_name,
        defaultPassword,
        user_role,
        designation,
      ]);

      return resp.insertId;
    },

    //getAllEmployee with password
    getAllEmployeesWithPassword: async function () {
      const sql = "SELECT * FROM employee";
      const [rows] = await connection.execute(sql);
      return rows;
    },

    //getAllEmployee without password
    getAllEmployeesWithoutPassword: async function () {
      // if(myCache.has("allEmployeesWithoutPassword")) {
      //   return myCache.get("allEmployeesWithoutPassword");
      // }

      const sql =
        "SELECT user_name, user_role, designation FROM employee";

        const [rows] = await connection.execute(sql);
        createCache.applyCache()

        return rows;
    },

    // get a employee by id
    getAEmployeeById: async function (id) {
      // if(myCache.has("getAEmployeeById")) {
      //   return myCache.get("getAEmployeeById");
      // }

      const sql = "SELECT * FROM employee WHERE id=?";
      const [employees] = await connection.execute(sql, [id]);
      // myCache.set("getAEmployeeById", employees, 5);
      createCache.applyCache()

      return employees[0];
    },

    // get currently logged in user
    getCurrentUser : async function(){
      // if(myCache.has("getCurrentUser")) {
      //   return myCache.get("getCurrentUser");
      // }

      const sql = "SELECT * FROM employee WHERE id=?";
      const [employees] = await connection.execute(sql);
      // myCache.set("getCurrentUser", rows, 5);
      createCache.applyCache()

      return employees[0];
    },

    // update employee
    updateEmployee: async function(user_name,designation,id){
      const sql = "UPDATE employee SET user_name=?, designation=? WHERE id=?";

        const [employee] = await connection.execute(sql, [user_name,designation,id]);
        return employee;
    },

    // update password
    updateEmployeePassword: async function(password,id){
      var salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password,salt);

      const sql = "UPDATE employee SET password=? WHERE id=?";
    
      const [employee] = await connection.execute(sql, [hashedPassword,id]);
        return employee;
      },
    // delete Employee
    deleteEmployee: async function(id){
      let sql = `DELETE FROM employee WHERE id = ?`;
        const [employee] = await connection.execute(sql,[id]);
        return employee;
    },

    // login
    getUser: async function (user_name) {

      const sql = "SELECT * FROM employee WHERE user_name = ?"; 
      const [rows, fields] = await connection.execute(sql,[user_name]);

      return rows[0];
    },

    // get user role
    getUserRole: async function(user_role){
      const sql = "SELECT * FROM employee WHERE user_role = ?";
      const [rows, feilds] = await connection.execute(sql,[user_role]);

      return rows[0];
    }
  };
  
};
