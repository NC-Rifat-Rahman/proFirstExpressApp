const express = require('express');
//const mysql = require('mysql');
const mysql = require('mysql2-promise')();
const db = require('./database');
const session = require('express-session');
const app = express();

app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

/*
// create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'office'
})

// connect to mysql
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected');
})
*/

// Create database
app.get('/createdb', (req, res) => {
    let sql = "CREATE DATABASE office"

    db.query(sql, err => {
        if (err) {
            throw err;
        }
        res.send("Database created");
    })
})

// create table
app.get('/createEmployee', (req, res) => {

    console.log(results);
    let sql = 'CREATE TABLE employee (id int AUTO_INCREMENT NOT NULL, user_name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, user_role VARCHAR(40) NOT NULL, designation VARCHAR(255) NOT NULL, PRIMARY KEY(id) )'

    db.query(sql, err => {
        if (err) {
            throw err;
        }
        res.send('Employee table created.')
    });
})

// to authorize access
function isAdmin(req) {
    return req.session.userRole === 'admin';
}


// add Employye // Register
app.post('/addEmployee', (req, res) => {
    if (!isAdmin(req)) {
        return res.status(403).send("UNAUTHORIZED");
    }

    const id = req.body.id;
    const user_name = req.body.user_name;
    const password = req.body.password;
    const user_role = req.body.user_role
    const designation = req.body.designation;

    const sql = 'INSERT INTO employee values(?,?,?,?,?)';


    const query = db.query(sql, [id, user_name, password, user_role, designation], (err, results) => {
        if (err) {
            console.log(err);
            return res.send("Internatl server error");

        } else {
            return res.send("Employee added Successfully");
        }



    });
})

//login
app.post("/login", (req,res)=>
{
        
    const {user_name,password} = req.body;

    db().getUserNameAndPassword(user_name,password);
    return res.status(200).send("Admin LoggedIn");
})

/*
// login
app.post("/login", (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;

    const sql = 'SELECT * FROM employee WHERE user_name = ? AND password = ?';

    const query = db.query(sql, [user_name, password], (err, results) => {
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
        }
        else if (results.length !== 0 && fetchUserRole === "admin") {
            console.log("Admin Login Successfull");
            req.session.isLoggedIn = true;
            req.session.userRole = results[0].user_role;

            return res.status(200).send("Admin LoggedIn");
        }
        else {
            console.log("Wrong info");

            return res.status(403).send("Invalid Username or password");
        }
    });

})
*/

//logout
app.delete("/logout", (req, res) => {
    req.session.destroy();
    res.send("logout");
})

// middleware to check if user is loggedin to access pages
app.use((req, res, next) => {
    if (req.session.isLoggedIn) {
        console.log("User loged in");
        //console.log(results);
        next();
    }
    else {
        console.log("Forbidden access");
        return res.status(403).send("Forbidden access");
    }
})

// dashboard
app.get('/dashboard', (req, res) => {
    return res.status(200).send("dashboard");
})

// select employees
app.get('/getEmployee', (req, res) => {

    if (!isAdmin(req)) {
        return res.status(403).send("UNAUTHORIZED");
    }
    const sql = 'SELECT * FROM employee'

    const query = db.query(sql, (err, results) => {
        if (err)
            throw err;
        //console.log(results);
        res.send('Employee details fetched');
    })
})

// select particular employee
app.get('/getEmployee/:id', (req, res) => {

    if (!isAdmin(req)) {
        return res.status(403).send("UNAUTHORIZED");
    }
    const fetchId = req.params.id;
    const sql = 'SELECT * FROM employee WHERE id=?';

    const query = db.query(sql, fetchId, (err, results) => {
        if (err)
            throw err;

        //console.log(results);
        res.send('Employee details fetched by id');
    })
})

// update 
app.put('/updateEmployee/:id', (req, res) => {

    if (!isAdmin(req)) {
        return res.status(403).send("UNAUTHORIZED");
    }
    const id = req.params.id;
    const user_name = req.body.user_name;
    const designation = req.body.designation;

    const sql = 'UPDATE employee SET user_name=?, designation=? WHERE id=?';

    const query = db.query(sql, [user_name, designation, id], (err, results) => {
        if (err)
            throw err;

        //console.log(results);
        res.send('Employee details updated');
    })

})

//delete 
app.delete('/deleteEmployee/:id', (req, res) => {

    if (!isAdmin(req)) {
        return res.status(403).send("UNAUTHORIZED");
    }
    let sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
    let query = db.query(sql, err => {
        if (err)
            throw err;
        res.send('Employee deleted');
    })
})


// create table for project
app.get('/createProject', (req, res) => {
    let sql = 'CREATE TABLE projects (id int AUTO_INCREMENT, name VARCHAR(255), employee_id int, PRIMARY KEY(id), FOREIGN KEY(employee_id) REFERENCES employee(id))'

    db.query(sql, err => {
        if (err) {
            throw err;
        }
        res.send('Projects table created.')
    });
})

// add projects
app.post('/addProjects', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const employee_id = req.body.employee_id;

    const sql = 'INSERT INTO projects values(?,?,?)';

    const query = db.query(sql, [id, name, employee_id], (err, results) => {
        if (err)
            console.log(err);
        else
            res.send("OKAY");
    });

})

app.listen('5000', () => {
    console.log('Server Started on port 5000');
})