const { log } = require("console");
var express = require("express");


var router = express.Router();

const User = require("../models/user");

const { check, validationResult } = require("express-validator");
const { isRegExp } = require("util");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//Register page
router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  [
    check("email", "กรุณาป้อนอีเมล").isEmail(),
    check("name", "กรุณาป้อนชื่อ").not().isEmpty(),
    check("password", "กรุณาป้อนรหัสผ่าน").not().isEmpty(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //Return Error to views
      console.log("Errors : ", result.errors);
      res.render("register", { errors: result.errors });
    } else {
      console.log(req.body);
      //Insert data
      const user = new User(({ name, email, password } = req.body));
      console.log("Save user", user);
      User.createUser(user, (err, user) => {
        if (err) throw err;
        else {
          console.log("Save success", user);
          res.redirect('/');
        }
      });
    }
  }
);

//Login page
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const user = ({ name, password } = req.body);
  console.log(req.body);
});

module.exports = router;
