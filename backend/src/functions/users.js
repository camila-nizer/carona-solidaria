const db= require("../database");
const {v4: uuidv4}= require("uuid")


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
            console.log("entrou no not found")
            //
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
    const idUser = req.query.id_user
    console.log(idUser)
    const findUser= `SELECT * FROM users INNER JOIN user_status on users.id_user = user_status.id_user  where users.id_user = '${idUser}'`
    db.query(findUser).then((result)=>{
        res.status(200).send(result)
    })
}

const getAllUsers = (req, res)=>{
    const findAllUsers = `SELECT * FROM users INNER JOIN user_status on users.id_user = user_status.id_user  ` //FUNÇÃO OK
    db.query(findAllUsers).then((result)=>{
        res.status(200).send(result)
    })
}

const getStatusUser = (req, res)=>{
    const findStatusUser= `SELECT user_status FROM users where "id_user"= '${req}' `
    db.query(findStatusUser).then((result)=>{
        res.status(200).send(result)
    })
}


const deleteUser = (req, res)=>{
    const idUser = req.body.id_user
    const idResponsavel= req.body.idResponsavel
    // insertNewStatus=(idUser, "deletado",  idResponsavel)
    try {
        insertNewStatus(idUser, "deletado",  idResponsavel)
        res.status(200).send("Usuário deletado com sucesso")

        
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
    let atualizar = `UPDATE users SET nome= '${nome}',  status_perfil= '${statusUser}',   where id_user ='${idUser}'`

    if (opcao=="telefone"){
        atualizar = `UPDATE users SET telefone= '${telefone}',  status_perfil= '${statusUser}',   where id_user ='${idUser}'`
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