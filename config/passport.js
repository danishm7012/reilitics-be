import fbStrategy from "passport-facebook";
const FacebookStrategy = fbStrategy.Strategy;
import User from "../models/userModel.js";

passport.use(
  new FacebookStrategy(
    {
      clientID: 413767533872321,
      clientSecret: "6bc3d7006cfd778f0c1aea7dc0a1c761",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ social_login_ID: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
