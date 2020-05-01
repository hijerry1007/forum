const express = require('express')
const app = express()
const db = require('./models') //引入資料庫
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
  console.log('app is running!')
})

require('./routes')(app)