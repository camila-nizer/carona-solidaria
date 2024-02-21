const express= require('express')
const app= express.Router()
const health = require('../health/health')

app.get('/health', health.health)

module.exports = app 