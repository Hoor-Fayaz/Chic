const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'place_holder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'place_holder',
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ 
          $or: [{ googleId: profile.id }, { email }] 
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            // passwordHash is optional for OAuth users
          });
        } else if (!user.googleId) {
          // Link existing email account to Google
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || 'place_holder',
      clientSecret: process.env.FACEBOOK_APP_SECRET || 'place_holder',
      callbackURL: '/api/v1/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
        let user = await User.findOne({ 
          $or: [{ facebookId: profile.id }, { email }] 
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            facebookId: profile.id,
          });
        } else if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// We are using JWT, so sessions are not strictly required for the API, 
// but passport requires these if you don't use { session: false } in routes
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
