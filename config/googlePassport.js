import generateToken from "../utils/generateToken.js";
import googleStrategy from "passport-google-oauth20";
import User from '../models/userModel.js'
const googlePassport = (passport) => {
  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALL_BACK_URL,
        // passReqToCallback: true,
      },
      (accessToken, refreshToken, profile, next) => {
       const getUser= User.findOne({ 'social_login_ID': profile.id }, async (err, user) => {
          // let token;
          // token = generateToken(user._id)
          console.log(user)
          if (user && (user.social_login === true)) return next(null, user);
          else { 
            const user = new User({
              social_login_ID: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              username: profile.displayName,
              image: profile.photos[0].value,
              packageID: '61e516f81a5bd094548e998e',
              packageStatus: true,
              social_login: true,
              social_provider: 'Google',
              email_varification: true
            });

            
            const newuser = await user.save();
            return next(null, newuser);
          }
          return next(err, user);
        });
        
      }
    )
  );
  passport.serializeUser((user, next) => {
    next(null, user);
  });
  passport.deserializeUser((user, next) => {
    next(null, user);
  });
};

export { googlePassport };
