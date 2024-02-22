const express= require('express')
const app= express.Router()
const health = require('../health/health')
const users = require('../functions/users')
const trips = require('../functions/trips')

app.get('/health', health.health)

app.get('/getAllUsers',users.getAllUsers)
app.get('/getUser',users.getUser)

app.post('/createUser', users.createUser)

app.put('/updateUser', users.updateUser)
app.put('/deleteUser', users.deleteUser) // apenas altera o status para excluído

app.get('/getActiveRide', trips.getActiveRide)
app.post('/getAllRides', trips.getAllRides)
app.put('/deleteRide', trips.updateRide)

module.exports = app 
