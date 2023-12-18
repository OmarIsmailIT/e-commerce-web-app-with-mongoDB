import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";

import User from "../models/user.model";
const passport = require("passport");
const bcrypt = require("bcrypt");
import { Strategy as LocalStrategy } from "passport-local";
import { jwtConfig } from "./jwt.config";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload._id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        if (!email || !password) {
          return done(null, false, {
            message: "Email and password are required in the request body.",
          });
        }
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        if (!req.body.email || !req.body.password) {
          // Check if email and password are present in the request body
          return done(null, false, {
            message: "Email and password are required in the request body.",
          });
        }

        // Check if email and password are not provided in the params
        if (req.params.email || req.params.password) {
          return done(null, false, {
            message: "Credentials should not be provided in the params.",
          });
        }
        const existingUser = await User.findOne({
          email: { $regex: new RegExp(email, "i") },
        });

        if (existingUser) {
          return done(null, false, { message: "That email is already taken." });
        }

        const { first_name, last_name, phone_number } = req.body;

        const newUser = new User();
        newUser.email = email;
        newUser.password = await bcrypt.hash(password, 10); // Hash the password
        newUser.first_name = first_name;
        newUser.last_name = last_name;
        newUser.phone_number = phone_number;
        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
export default passport;
