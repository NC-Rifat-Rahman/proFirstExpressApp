const session = require("express-session");
const dbLogic = require("./database");
const employee = require("./employee-router");
// const sessionConfig = {
//   // const app = express();

//   // app.use(
//   //     session({
//   //       secret: "keyboard cat",
//   //       resave: false,
//   //       saveUninitialized: true,
//   //     })
//   //   );

//   secret: "keyboard cat",
//   resave: false,
//   saveUninitialized: true,
// };

function configureSession(app) {
  app.use(
    session({
      secret: "new pass",
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

    isAdminLoggedIn: function(req){
      return req.session.userRole === 'admin';
    },
    isUserLoggedIn: function(req){
      return true;
    },
  }
}

// module.exports = session(sessionConfig);
module.exports = configureSession;
