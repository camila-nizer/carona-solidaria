const db= require("../database");
const {v4: uuidv4}= require("uuid")
const crypto = require('crypto');


const findByCPF=(cpf)=>{
    return new Promise((resolve, reject) => {
        const pesquisa= `SELECT * FROM users where cpf = '${cpf}'`
        db.query(pesquisa).then((result)=> { 
            if (result.length>=1){
                resolve(result[0].id_user)
            }else{
                resolve(false)
            }   
        })
    })
}

const hashPassword=(password)=>{
        const hash = crypto.createHash('md5').update(password).digest('hex');
        console.log(toString(hash));
        return hash
}

const insertNewStatus=(idUser, status,  responsavel)=>{
    return new Promise((resolve, reject) => {
        const idUserStatus= uuidv4();
        const statusUser = status
        const responsavelUser= responsavel
        

    const createStatusUser=`INSERT INTO user_status ("id_user_status", 
            "id_user", 
            "status",
            "responsável",
            "created_at") 
            VALUES (
            '${idUserStatus}',
            '${idUser}',
            '${statusUser}',
            '${responsavelUser}',
            NOW())` 

    db.query(createStatusUser).then((result)=>{
        return true
    })
    })
}


const createUser = (req, res)=>{
    console.log(req.body)
    const idUser = uuidv4();
    const nome = req.body.nome
    const cpf = req.body.cpf
    const nasc = req.body.nasc
    const email= req.body.email
    const tipo_usuario = req.body.tipo_usuario
    const cnh = req.body.cnh
    const vinculoFMP= req.body.vinculoFMP
    const matricula= req.body.matricula
    const telefone= req.body.telefone
    const senha_hash= req.body.senha_hash

    findByCPF(cpf).then((found)=> {
        console.log("found ")
        console.log(found)
        if (!found){
            const hashPass = hashPassword(senha_hash)

            const createUser= `INSERT INTO users (
                "id_user",
                nome, 
                cpf, 
                nasc, 
                email, 
                telefone, 
                tipo_usuario, 
                cnh, 
                vinculo_fmp, 
                matricula, 
                senha_hash) 
            VALUES ('${idUser}',
            '${nome}',
            '${cpf}',
            '${nasc}',
            '${email}',
            '${telefone}',
            '${tipo_usuario}',
            '${cnh}',
            '${vinculoFMP}',
            '${matricula}',
            '${hashPass}')`
            db.query(createUser).then((result)=>{
                booleanStatus= insertNewStatus(idUser, 'ativo', 'newUser')
                if (booleanStatus){
                    res.status(200).send("Dados salvos com sucesso")
                }
            })
        }else{
            res.status(400).send("Usuário já existe, caso não lembre a senha favor entrar em contato com a administração da aplicação.")
        }
    })    

}

const getUser = (req, res)=>{
    const idUser = req.query.id_user
    const findUser= `SELECT
    users.id_user AS usuarios,
    users.nome as nome,
    users.cpf as cpf,
    users.nasc as nascimento,
    users.email as email,
    users.telefone as telefone,
    users.tipo_usuario as tipo_usuario,
    users.cnh as cnh,
    users.vinculo_fmp as vinculo_fmp,
    users.matricula as matricula,
    json_agg(us ORDER BY us.created_at DESC) as status_array
   FROM users
   INNER JOIN user_status us ON users.id_user = us.id_user
   where users.id_user = '${idUser}'
   GROUP BY usuarios;`
    db.query(findUser).then((result)=>{
        res.status(200).send(result)
    })
}

const getAllUsers = (req, res)=>{
    const findAllUsers = `SELECT
    users.id_user AS usuarios,
    users.nome as nome,
    users.cpf as cpf,
    users.nasc as nascimento,
    users.email as email,
    users.telefone as telefone,
    users.tipo_usuario as tipo_usuario,
    users.cnh as cnh,
    users.vinculo_fmp as vinculo_fmp,
    users.matricula as matricula,
    json_agg(us ORDER BY us.created_at DESC) as status_array
   FROM users
   INNER JOIN user_status us ON users.id_user = us.id_user
   GROUP BY usuarios;` //FUNÇÃO OK
    result_array= []
    db.query(findAllUsers).then((result)=>{
        res.status(200).send(result)
    })
}

const updateReativaUsuario = (req, res)=>{
    const idUser = req.body.id_user
    const idResponsavel= req.body.idResponsavel    

    try {
        db.query(atualizar).then((result)=>{
            insertNewStatus(idUser, "ativo",  idResponsavel)
            res.status(200).send("Usuário reativado com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel reativar usuário: ", error)
    }
}


const deleteUser = (req, res)=>{
    const idUser = req.body.id_user
    const idResponsavel= req.body.idResponsavel

    try {
        insertNewStatus(idUser, "deletado",  idResponsavel)
        res.status(200).send("Usuário deletado com sucesso")

        
    } catch (error) {
        res.status(400).send("Erro ao deletar usuário: " + error)
    }
                
}

const updateUser = (req, res)=>{
    const idUser = req.body.id_user
    const nome= req.body.nome
    const idResponsavel= req.body.idResponsavel    
    const telefone=req.body.telefone
    const opcao=req.body.opcao

    let atualizar = `UPDATE users SET nome= '${nome}' where id_user ='${idUser}'`

    if (opcao=="telefone"){
        atualizar = `UPDATE users SET telefone= '${telefone}' where id_user ='${idUser}'`
    }
    try {
        db.query(atualizar).then((result)=>{
            insertNewStatus(idUser, "editado",  idResponsavel)
            res.status(200).send("Dados atualizados com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel atualizar: ", error)
    }
}

const newPasswordUser = (req, res)=>{
    const idUser = req.body.id_user
    const newPassword= req.body.senha_hash
    const idResponsavel= req.body.idResponsavel   
    const pass_hash = hashPassword(newPassword) 

    let atualizarSenha = `UPDATE users SET senha_hash= '${pass_hash}' where id_user ='${idUser}'`

    try {
        db.query(atualizarSenha).then((result)=>{
            insertNewStatus(idUser, "editado",  idResponsavel)
            res.status(200).send("Senha atualizada com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel atualizar a senha: ", error)
    }
}


module.exports = {
    createUser: createUser,
    getUser: getUser,
    getAllUsers:getAllUsers, //função para adm pegar todos os usuários
    updateUser: updateUser,
    deleteUser: deleteUser,
    updateReativaUsuario:updateReativaUsuario, //função para adm reativar usuario
    newPasswordUser:newPasswordUser, //FUNÇÃO TROCA SENHA (apenas adm pode trocar) TODO: FUNÇÃO PARA USUARIO TROCAR SENHA
}