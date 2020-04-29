const express = require('express')
const app = express()
const handlebars = require('express-handlebars')

app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(3000, () => {
  console.log('app is running!')
})