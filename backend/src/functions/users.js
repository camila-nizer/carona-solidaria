const db= require("../database");
const {v4: uuidv4}= require("uuid")


const findByCPF=(cpf)=>{
    return new Promise((resolve, reject) => {
        const pesquisa= `SELECT * FROM users where cpf = '${cpf}'`
        db.query(pesquisa).then((result)=> { 
            if (result.length>=1){
                resolve(result[0].ID_USER)
            }else{
                resolve(false)
            }   
        })
    })
}

const insertNewStatus=(idUser, status,  responsavel)=>{
    return new Promise((resolve, reject) => {
        const idUserStatus= uuidv4();
        const status_perfil=
        {
        createdAt: Date.now(),
        status: status,
        responsavel:responsavel,
        }

    const status_perfilString= JSON.stringify(status_perfil)
    const createStatusUser=`INSERT INTO user_status ("id_user_status", 
            "ID_USER", 
            status) 
            VALUES ('${idUserStatus}',
            '${idUser}',
            ARRAY ['${status_perfilString}']::json[])` 

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
            console.log("entrou no not found")
            //
            const createUser= `INSERT INTO users (
                "ID_USER",
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
            '${senha_hash}')`
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
//TODO: VERIFICAR COMO TABELA DE STATUS VOLTA PRA TALVEZ CRIAR FUNÇÃO PRA PEGAR O MAIS RECENTE
const getUser = (req, res)=>{
    const idUser = req.query.idUser
    console.log(idUser)
    const findUser= `SELECT * FROM users where "ID_USER" = '${idUser}'`
    //TODO: FAZER INNER JOIN PRA PEGAR TABELA DE STATUS
    db.query(findUser).then((result)=>{
        res.status(200).send(result)
    })
}

const getAllUsers = (req, res)=>{
    const findAllUsers = `SELECT * FROM users inner join user_status status `
    //TODO: FUNÇÃO NÃO ESTÁ FUNCIONANDO, VERIFICAR INNER JOIN
    db.query(findAllUsers).then((result)=>{
        res.status(200).send(result)
    })
}

const getStatusUser = (req, res)=>{
    const findStatusUser= `SELECT user_status FROM users where "ID_USER"= '${req}' `
    db.query(findStatusUser).then((result)=>{
        res.status(200).send(result)
    })
}


const deleteUser = (req, res)=>{
    const idUser = req.body.idUser
    const idResponsavel= req.body.idResponsavel
    let newStatusUser= getStatusUser(idUser)
    let statusUser=[{   createAt: Date.now(),
            status: 'deletado',
            responsavel:idResponsavel,
            }]
            //TODO: VERIFICAR ISSO AQUIIIIII
    //statusUser.unshift(newStatusUser);
    const status_perfilString= JSON.stringify(statusUser)

    try {
        const updateUser= `UPDATE users SET status_perfil = ARRAY ['${status_perfilString}']::json[] 
        where "ID_USER" ='${idUser}'`
        db.query(updateUser).then((result)=>{
            console.log("entrou no opdate user (delete)")
            res.status(200).send("Usuário deletado com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Erro ao deletar usuário: " + error)
    }
                
}

const updateUser = (req, res)=>{

    const idUser = req.body.idUser
    const nome= req.body.nome
    const idResponsavel= req.body.idResponsavel
    const newStatusUser= getStatusUser(idUser)
    
    const telefone=req.body.telefone
    const opcao=req.body.opcao

    let statusUser=[
        {
            createAt: Date.now(),
            status: 'editado',
            responsavel:idResponsavel,
            }
    ] 
    statusUser.unshift(newStatusUser);
    let atualizar = `UPDATE users SET nome= '${nome}',  status_perfil= '${statusUser}',   where ID_USER ='${idUser}'`

    if (opcao=="telefone"){
        atualizar = `UPDATE users SET telefone= '${telefone}',  status_perfil= '${statusUser}',   where ID_USER ='${idUser}'`
    }


    try {
        db.query(atualizar).then((result)=>{
            res.status(200).send("Dados atualizados com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel atualizar: ", error)
    }
}


module.exports = {
    createUser: createUser,
    getUser: getUser,
    getAllUsers:getAllUsers, //de adm pegar todos os usuários
    updateUser: updateUser,
    deleteUser: deleteUser,
}