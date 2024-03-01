const express= require('express')
const app= express.Router()
const health = require('../health/health')
const users = require('../functions/users')
const trips = require('../functions/trips')

//FUNÇÃO DO SISTEMA
app.get('/health', health.health) //verifica se a aplicação está de pé

//FUNÇÕES PARA USUARIOS 
app.get('/getAllUsers',users.getAllUsers) // adm pega todos os usuarios
app.get('/getUser',users.getUser) // pega usuário específico passando por parametro o id

app.post('/createUser', users.createUser) // cria usuario . tipo_usuario: motorista ou usuario(carona)

app.put('/updateUser', users.updateUser) //pode alterar nome ou telefone
app.put('/deleteUser', users.deleteUser) // apenas altera o status para excluído (update status)
app.put('/reativeUser',users.updateReativaUsuario) // adm reativa usuario
app.put('/newPassword',users.newPasswordUser) // adm a altera senha usuário 
//TODO: CRIAR MODO DE REDEFINIÇÃO DE SENHA PARA USUARIO

//FUNÇÕES PARA CORRIDAS
app.post('/createRide', trips.createRide) // cria corrida.
app.get('/getActiveRide', trips.getActiveRide) //pega apenas corridas ativas
app.get('/getAllRidesUser', trips.getAllRidesUser) //usuário pega todas as corridas
app.get('/getActiveRidesUser', trips.getActiveRidesUser) //usuário pega todas as corridas ATIVAS
app.get('/getAllRidesADM', trips.getAllRidesADM) // adm pega todas as corridas
app.put('/deleteRide', trips.deleteRide) // apenas altera o status para excluído (update status)

//FUNÇÕES PARA CONVITES
app.post('/createInvite', invites.createInvite) // cria o convite.
app.get('/getInvites', invites.getInvites) //pega convites passando por parametro o user id
app.get('/getAllInvites', invites.getInvites) //administrador pega todos os convites
app.put('/deleteInvite', invites.getActiveRidesUser) // apenas altera o status do convite para excluído (update status)

module.exports = app 
