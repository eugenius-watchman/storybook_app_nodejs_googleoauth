
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
 
// interact with db
module.exports = function(passport){
        // create google strategy
        passport.use( new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
        }, 
        async (accessToken, refreshToken, profile, done) => {
            //console.log(profile)
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            }

            try { // store user 
                let user = await User.findOne({ googleId: profile.id})

                if(user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }
        
        }
    )
)

    // serializer and deserializer from passports.js
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
    //   passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => done(err, user))});
    // Deserialize user (updated to use async/await)
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
} 