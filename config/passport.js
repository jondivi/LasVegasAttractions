// allows access to the Strategy constructor from the passport-local dependency, which authenticates users using a username and password
const LocalStrategy = require('passport-local').Strategy
// mongoose is not used in this file, but it is used by the following dependency. Still unsure if we really need it here.
const mongoose = require('mongoose')
// provides access to the users' username, email, and password
const User = require('../models/User')

module.exports = function (passport) {
  // using the passport-local dependency to pull the user data and verify it
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // checking if the user trying to log in is already in the database
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      // if there was a problem trying to access the db or searching for the user, return the error.
      if (err) { return done(err) }
      // if no user was found in the db, display message
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` })
      }
      //if a user was found but it doesn't have a password, it means the user registered using an account from a 3rd party, ex. Google, Discord so they should sign in through them.
      if (!user.password) {
        return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' })
      }
      // checking to see if the password entered matches the one in the db
      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err) } // if an error occured before a comparison could be made, return error
        if (isMatch) { // if the password matches, continue the opperation
          return done(null, user)
        } 
        // if there was no error but the passwords don't match, the user entered the wrong password
        return done(null, false, { msg: 'Invalid email or password.' })
      })
    })
  }))
  
  // creates a unique id for the user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  // not sure, is it creating an error the next time that user is accessed? is it logging out the user?
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
