const routes= require("./src/routes/routes.js")
const express = require('express')
const cors= require('cors')
const bodyParser= require('body-parser')
const app = express()
const port = 3000

// var allowlist = ['http://localhost:4000', 'localhost:4000']
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
// app.use(cors(corsOptionsDelegate))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routes)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})