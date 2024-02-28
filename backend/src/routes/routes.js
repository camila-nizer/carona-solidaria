const express= require('express')
const app= express.Router()
const health = require('../health/health')
const users = require('../functions/users')
const trips = require('../functions/trips')

app.get('/health', health.health) //verifica se a aplicação está de pé

//FUNÇÕES PARA USUARIOS 
app.get('/getAllUsers',users.getAllUsers) // adm pega todos os usuarios
app.get('/getUser',users.getUser) // pega usuário específico

app.post('/createUser', users.createUser) // cria usuario . tipo_usuario: motorista ou usuario(carona)

app.put('/updateUser', users.updateUser) //pode alterar nome ou telefone
app.put('/deleteUser', users.deleteUser) // apenas altera o status para excluído (update status)
app.put('/reativeUser',users.updateReativaUsuario) // adm reativa usuario
app.put('/newPassword',users.newPasswordUser) // adm a altera senha usuário 
//TODO: CRIAR MODO DE REDEFINIÇÃO DE SENHA PARA USUARIO

//FUNÇÕES PARA CORRIDAS
app.get('/getActiveRide', trips.getActiveRide) //pega apenas corridas ativas
app.get('/getAllRidesUser', trips.getAllRidesUser) //usuário pega todas as corridas
app.get('/getActiveRidesUser', trips.getActiveRidesUser) //usuário pega todas as corridas ATIVAS
app.get('/getAllRidesADM', trips.getAllRidesADM) // adm pega todas as corridas
app.put('/deleteRide', trips.updateRide) // apenas altera o status para excluído (update status)

//FUNÇÕES PARA CONVITES
//TODO

module.exports = app 
