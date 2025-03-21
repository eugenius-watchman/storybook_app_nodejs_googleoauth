const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo') // making sure its bellow exp-session
const connectDB = require('./config/db')

// *** Configs ***
// load config file 
// dotenv.config({path: './config/config.env'}) // where we put all global variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });


// passport config
require('./config/passport')(passport)


// calling connect db
connectDB()

// initialize app with express 
const app = express()


//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// method override
//app.use(bodyParser.urlencoded())
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method 
    delete req.body._method
    return method
  }
}))


// *** middlewares *** 
// running in dev mode ... morgan 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


// Handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

  
// handlebars middleware 
app.engine(
    '.hbs', 
    exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    }, 
    defaultLayout: 'main', 
    extname: '.hbs' 
    })
)
app.set('view engine', '.hbs');

// sessions middleware
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     // cookie: { secure: true }
//   }))
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat', // use environment variable
    resave: false,
    saveUninitialized: false,
    //store: new MongoStore({ mongooseConnection: mongoose.connection }), // Use Mongoose connection
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI, // use MongoDB connection string

    }),
}));


// passport middleware
app.use(passport.initialize())
app.use(passport.session())


// set global variable
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// static folder 
app.use(express.static(path.join(__dirname, 'public')))


// routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))




// ports
const PORT = process.env.PORT || 3000

// listen port
app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)