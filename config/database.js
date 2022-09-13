//bring in the mongoose dependency
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // attempt to connect to database
    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //the following options are deprecated.
      // useFindAndModify: false,
      // useCreateIndex: true
    })

    // print to console if successful
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    // otherwise print the error to the console
    console.error(err)
    process.exit(1)
  }
}

//export the file that creates a connection to the database
module.exports = connectDB
