const express= require('express')
const app= express.Router()
const health = require('../health/health')
const users = require('../functions/users')
const trips = require('../functions/trips')

app.get('/health', health.health) //verifica se a aplicação está de pé

app.get('/getAllUsers',users.getAllUsers) // adm pega todos os usuarios
app.get('/getUser',users.getUser) // pega usuário específico

app.post('/createUser', users.createUser) // cria usuario . tipo_usuario: motorista ou usuario(carona)

app.put('/updateUser', users.updateUser) //pode alterar nome ou telefone
app.put('/deleteUser', users.deleteUser) // apenas altera o status para excluído
app.put('/reativeUser',users.updateReativaUsuario) // adm reativa usuario
app.put('/newPassword',users.newPasswordUser) // adm a altera senha usuário 
//TODO: CRIAR MODO DE REDEFINIÇÃO DE SENHA

app.get('/getActiveRide', trips.getActiveRide)

app.get('/getAllRides', trips.getAllRides)
app.get('/getAllRidesADM', trips.getAllRidesADM)

app.put('/deleteRide', trips.updateRide)

module.exports = app 
