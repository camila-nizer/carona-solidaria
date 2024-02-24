const pgp = require("pg-promise")()
const {join} = require("node:path")

const db=pgp("postgres://postgres:camila@localhost:4000/caronaSolidaria")
//db.query("SELECT 1+1 AS result").then((result)=> console.log(result))
module.exports= db


//COMANDOS
//cd "C:\Program Files\PostgreSQL\15\bin"
//.\psql.exe -p 4000 -U postgres -d trabalhoRafael
//EXIBIR TABELA: SELECT * FROM tabelaTelefones; 
//super senha: camila