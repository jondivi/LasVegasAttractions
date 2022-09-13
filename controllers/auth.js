// connecting to dependencies that help validate users
const passport = require('passport')
const validator = require('validator')
// accessing the User model to be able to send/receive user data from the database
const User = require('../models/User')
  // idk what .getLogin is doing, but I see that it redirects the users to their list.
  // is this checking for users that are already logged in?
 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/attractions')
    }
    res.render('login', {
      title: 'Login'
    })
  }
  // checks the user input for a valid email address and password
  exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })

    //  sends the error msgs to the Login page
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      // refreshes page to display the errors
      return res.redirect('/login')
    }
    // idk what this is doing to the emails
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    // verifies the user
    passport.authenticate('local', (err, user, info) => {
      // if there was an issue verifying the user, skip the rest of this code block (?) 
      if (err) { return next(err) }
      // if the user was not found, display the message to the user and refresh login page
      if (!user) {
        req.flash('errors', info)
        return res.redirect('/login')
      }
      
      req.logIn(user, (err) => {
        // skips the codeblock if there was an error logging in
        if (err) { return next(err) }
        // sends message upon successful login
        req.flash('success', { msg: 'Success! You are logged in.' })
        // returns the useer to the page they were on (except for login page) or their list of attractions if they didn't have a previous session
        res.redirect(req.session.returnTo || '/attractions')
      })
    })(req, res, next)
  }
  // logs out user by deleting their session, sends confirmation message to console 
  exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {
      // if there was an error logging out, sends the following message to the console
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null // not sure what effect this has
      res.redirect('/') // serves the home page
    })
  }
  exports.getSignup = (req, res) => {
    // if a user match already exists in the db, send them to their list
    if (req.user) {
      return res.redirect('/attractions')
    }
    // if it's a new user, send them to the 'signup' page
    res.render('signup', {
      title: 'Create Account'
    })
  }
  // checks the user input for: 
  exports.postSignup = (req, res, next) => {
    const validationErrors = []
    // a valid email address 
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    // and proper passport creation
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
    // if the email and/or password were not proper, 
    if (validationErrors.length) {
      // send the error messages to the user
      req.flash('errors', validationErrors)
      // and refresh the page to display the messages
      return res.redirect('../signup')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
    
    // creates a new user by sending the information in the request from the signup page to the User model
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
    // tries to find a matching email or userName
    User.findOne({$or: [
      {email: req.body.email},
      {userName: req.body.userName}
    ]}, (err, existingUser) => {
      // if an error was encountered, skip the rest of the codeblock and return the error
      if (err) { return next(err) }
      // if the userName or email is already in the db, 
      if (existingUser) {
        // send the following mesg to the user
        req.flash('errors', { msg: 'Account with that email address or username already exists.' })
        // refresh the page so that the msg is displayed
        return res.redirect('../signup')
      }
      user.save((err) => {
        // if there was an error creating the new user, skip the codeblock and return error
        if (err) { return next(err) }
        // log in the new user
        req.logIn(user, (err) => {
          // if there was an error logging in the new user, skip the codeblock and return error
          if (err) { return next(err) }
          // redirect the new user to their list
          res.redirect('/attractions')
        })
      })
    })
  }