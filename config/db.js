const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // stop warnings in console
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false  
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        // if something goes wrong 
        console.error(err)
        process.exit(1) // exit with failure 
    }
}

module.exports = connectDB