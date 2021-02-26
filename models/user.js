const mongoose = require("mongoose");
const mongoDB = "mongodb://localhost:55000/loginDB";
const bcrypt = require("bcryptjs");

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
});

//Connect
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongodb connect Error"));

//Create schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = (module.exports = mongoose.model("User", userSchema));
module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      // Store hash in your password DB.
      newUser.password=hash;
      newUser.save(callback);
    });
  });
  
};
