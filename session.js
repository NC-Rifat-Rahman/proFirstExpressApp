const express = require('express');
const mysql = require('mysql');
var parseurl = require('parseurl')
const session = require('express-session');


var app = express()

// create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'password',
    database: 'office'
})

// connect to mysql
db.connect(err =>
{
    if(err)
    {
        throw err;
    }
    console.log('MySql Connected');
})


// Create database
app.get('/createdb',(req,res) =>
{
    let sql = "CREATE DATABASE office"

    db.query(sql, err =>
    {
        if(err)
        {
            throw err;
        }
        res.send("Database created");
    })
})

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// middleware to test if authenticated
function isAuthenticated (req, res, next) 
{
    if (req.session.user) next()
    else next('route')
}
  
app.get('/', isAuthenticated, function (req, res) 
{
    // this is only called when there is an authentication user due to isAuthenticated
    res.send('hello, ' + escapeHtml(req.session.user) + '!' +
      ' <a href="/logout">Logout</a>')
})
  

  
  app.post('/login', express.urlencoded({ extended: false }), function (req, res) {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works
  
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
  
      // store user information in session, typically a user id
      req.session.user = req.body.user
  
      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err)
        res.redirect('/')
      })
    })
  })

/*
app.use(function (req, res, next) {

//console.log(req.session);

  if (!req.session.views) {
    req.session.views = {}
  }

  //console.log(req.session.views);

  // get the url pathname
  var pathname = parseurl(req).pathname

  //console.log({pathname});

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

  //console.log(req.session.views);

  next()
})

app.get('/login', function (req, res) {
    
})

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
*/
app.listen(3000)