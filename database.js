const mysql = require("mysql2/promise");
const ResultSetHeader =  require("mysql2");

module.exports = async function createDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "office",
  });

  return {
    //create table
    createTable: async function () {
      let sql =
        "CREATE TABLE employeess (id int AUTO_INCREMENT NOT NULL, user_name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, user_role VARCHAR(40) NOT NULL, designation VARCHAR(255) NOT NULL, PRIMARY KEY(id) )";
        
      const response = await connection.execute(sql);
      
      function isTableCreated(){
        if(sql==='')
          return false;
        else 
          return true;
      }
      console.log("Inside sql");
      console.log(typeof(sql));
      return response;
    },
    //addEmployee --Register
    userRegister: async function (user_name, password, user_role, designation) {
      const sql =
        "INSERT INTO employee(user_name, password, user_role, designation) values(?,?,?,?)";

      const [resp] = await connection.execute(sql, [
        user_name,
        password,
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
      const sql =
        "SELECT user_name,password, user_role, designation FROM employee";

        const [rows] = await connection.execute(sql);
        return rows;
    },

    // get a employee by id
    getAEmployeeById: async function (id) {
      const sql = "SELECT * FROM employee WHERE id=?";
        const [employees] = await connection.execute(sql, [id]);

        return employees[0];
    },

    // update employee
    updateEmployee: async function(user_name,designation,id){
      const sql = "UPDATE employee SET user_name=?, designation=? WHERE id=?";

        const [employee] = await connection.execute<ResultSetHeader>(sql, [user_name,designation,id]);
        return employee;
    },
    // delete Employee
    deleteEmployee: async function(id){
      let sql = `DELETE FROM employee WHERE id = ?`;
        await connection.execute(sql,[id]);
    },
    // login
    getUser: async function (user_name) {
      const [rows, fields] = await connection.execute(
        "SELECT * FROM employee WHERE user_name = ?",
        [user_name]
      );

      return rows[0];
    },
  };
};
