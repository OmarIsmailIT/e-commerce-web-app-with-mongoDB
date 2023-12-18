import * as express from "express";
import * as passport from "passport";
import * as jwt from "jsonwebtoken";


const User = require("../models/user.model");
const router = express.Router();

router.post("/", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: typeof User, info: any) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Authentication error: " + err.message });
      }
      if (!user) {
        // Authentication failed
        if (info && info.message === "Incorrect username.") {
          return res.status(401).json({ message: "Incorrect email." });
        } else if (info && info.message === "Incorrect password.") {
          return res.status(401).json({ message: "Incorrect password." });
        } else {
          return res
            .status(401)
            .json({
              message: "Authentication failed. Incorrect email or password.",
            });
        }
      }

      // Authentication successful, generate a JWT token
      const token = jwt.sign({ _id: user._id }, "top-secret", {
        expiresIn: "1h",
      });
      return res.json({ token: "Bearer " + token });
    }
  )(req, res, next);
});

export default router;
