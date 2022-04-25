const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const { TeacherModal, StudentModal } = require('@models')

require('dotenv').config();

//localStrategy
passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
  session: false
}, (req, email, password, result) => {
  console.log("req from passport", req);
  let modal = null;
  req.baseUrl === '/student' ?
    modal = StudentModal : modal = TeacherModal
  modal.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        console.log(user)
        if (!bcrypt.compareSync(password, user.password)) { return result(null, false); }
        result(null, user);
        return;
      }

      // not found Customer with the id
      result(null, false);
    }).catch((err) => {
      console.log("error: ", err);
      result(err, null);
      return;
    });

}));

//JWTStrategy

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.algorithms = [process.env.JWT_ALGORITHM];

passport.use(new JwtStrategy(opts, (jwt_payload, result) => {
  console.log("executing * callback verify * from jwt strategy ");
  console.log(jwt_payload)
  TeacherModal.findOne({ email: jwt_payload.email })
    .exec()
    .then((user) => {
      if (user) {
        result(null, user);
        return;
      }

      // not found Customer with the id
      result(err, "User not found");
    }).catch((err) => {
      console.log("error: ", err);
      result(err, null);
      return;
    });

}));

