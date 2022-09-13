const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')//(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const attractionRoutes = require('./routes/attractions')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')

// the css file wasn't taking effect until I added '/public'
app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
    })
  )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
  
app.use('/', mainRoutes)
app.use('/attractions', attractionRoutes)

app.listen(process.env.PORT, ()=>{
  console.log(`The Las Vegas attraction server is running!`)
})    