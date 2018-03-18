/* eslint-disable no-console */
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const helmet = require('helmet')
const http = require('http')
const https = require('https')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')

const config = require('./config.json')

const {
  port,
  logDir,
  privateKey,
  certificate
} = config

const accessLog = rfs('access.log', {
  interval: '1d',
  path: logDir || `${__dirname}/logs/`
})

console.log(`Starting in ${process.env.NODE_ENV} mode.`)

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('combined', { stream: accessLog }))

require('./routes')(app)

app.get('/status', (req, res) => {
  res.send(200)
})

if (process.env.NODE_ENV === 'production') {
  const options = {
    cert: fs.readFileSync(certificate),
    key: fs.readFileSync(privateKey)
  }
  https.createServer(options, app).listen(port)
  console.log(`HTTPS server started on port ${port}.`)
} else {
  http.createServer(app).listen(port)
  console.log(`HTTP server started on port ${port}.`)
}
