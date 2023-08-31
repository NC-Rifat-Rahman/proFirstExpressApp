const session = require("express-session");
const createDatabase = require("./database");
const employee = require("./employee-router");
const MySQLStore = require('express-mysql-session')(session);

function configureSession(app) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  return {
    setUserLogin: function(req) {
      return req.session.isUserLoggedIn = true;
    },

    setUserRole: function (req, user_role) {
      return req.session.userRole = user_role;
    },

    setUserId: function(req,id){
      req.session.userId = id;
    },

    getUserId: function(req,id){
      return req.session.userId;
    },

    isAdminLoggedIn: function(req){
      return req.session.userRole === 'admin';
    },
    isUserLoggedIn: function(req){
      return true;
    }
  }
}

// module.exports = session(sessionConfig);
module.exports = configureSession;
