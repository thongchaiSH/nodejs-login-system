// Router

const { log } = require("console");
var express = require("express");

var router = express.Router();

const User = require("../models/user");

const { check, validationResult } = require("express-validator");

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

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
          res.redirect("/");
        }
      });
    }
  }
);

//Login page
router.get("/login", (req, res) => {
  res.render("login");
});

//Logout page
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect('/');
});



router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
    // successRedirect: "/",
  }),
  (req, res) => {
    // const user = ({ name, password } = req.body);
    // console.log(req.body);
    req.flash('success','ลงชื่อเข้าใช้เรียบร้อยแล้ว')
    res.redirect("/"); 
  }
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(`Username = ${username} , Password = ${password}`);
    User.getUserByName(username, (err, user) => {
      // console.log("LocalStrategy", user);
      if (err) throw err;
      if (!user) {
        console.log("ไม่พบผู้ใช้งานในระบบ!!");
        return done(null, false);
      } else {
        //ถอดรหัส password ตรวจสอบ password ว่าตรงกันไหม
        User.verifyPassword(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if(isMatch){
            return done(null, user);
          }else{
            console.log("รหัสผ่านไม่ถูกต้อง");
            return done(null, false);
          }
        });
      }
      
    });
  })
);

module.exports = router;
