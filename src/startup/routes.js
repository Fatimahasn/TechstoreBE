const {
    users,
  } = require("./../routes");
  
  module.exports = function (app) {
    //----------------------------------
    app.use("/api/user", users);
    //----------------------------------
  };
  