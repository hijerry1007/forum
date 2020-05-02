const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const db = require('./models') //引入資料庫
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  console.log('app is running!')
})

require('./routes')(app, passport)