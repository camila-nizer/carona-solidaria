const db= require("../database");
const {v4: uuidv4}= require("uuid")


const findByCPF=(cpf)=>{
    return new Promise((resolve, reject) => {
        const pesquisa= `SELECT * FROM users where cpf = '${cpf}'`
        db.query(pesquisa).then((result)=> { 
            if (result.length>=1){
                resolve(result[0].id)
            }else{
                resolve(false)
            }   
        })
    })
}


const createUser = (req, res)=>{
    const idUser = uuidv4();
    const nome = req.body.nome
    const cpf = req.body.cpf
    const nasc = req.body.nascimento
    const email= req.body.email
    const tipo_usuario = req.body.tipo_usuario
    const cnh = req.body.cnh
    const vinculoFMP= req.body.vinculoFMP
    const matricula= req.body.matricula
    const status_perfil=  [
        {
        createAt: Date.now(),
        status: 'ativo',
        responsavel:'',
        }
    ]
    const telefone= req.body.telefone
    const senha_hash= req.body.senha_hash

    findByCPF(cpf).then((found)=> {
        if (!found){
            const createUser= `INSERT INTO users (ID_USER, nome, cpf, nasc, email, telefone, tipo_usuario, cnh, 
                vinculo_fmp, matricula, status_perfil, senha_hash) VALUES (
                    '${idUser}',
                    '${nome}',
                    '${cpf}',
                    '${nasc}',
                    '${email}',
                    '${telefone}',
                    '${tipo_usuario}',
                    '${cnh}',
                    '${vinculoFMP}',
                    '${matricula}',
                    ARRAY [${status_perfil}],
                    '${senha_hash}',
                )`
            db.query(createUser).then((result)=>{
                res.status(200).send("Dados salvos com sucesso")
            })           
        }else{
            res.status(400).send("Usuário já existe.")
        }
    })    

}
const getUser = (req, res)=>{
    const idUser = req.query.idUser
    const findUser= `SELECT * FROM users where ID_USER = '${idUser}'`
    db.query(findUser).then((result)=>{
        res.status(200).send(result)
    })
}

const getAllUsers = (req, res)=>{
    const findAllUsers = `SELECT * FROM users`
    db.query(findAllUsers).then((result)=>{
        res.status(200).send(result)
    })
}

const getStatusUser = (req, res)=>{
    idUser = req.query.idUser
    const findStatusUser= `SELECT status_perfil FROM users where ID_USER= '${idUser}' `
    db.query(findStatusUser).then((result)=>{
        res.status(200).send(result)
    })
}


const deleteUser = (req, res)=>{
    const idUser = req.body.idUser
    const idResponsavel= req.body.idResponsavel
    const newStatusUser= getStatusUser(idUser)
    let statusUser=[
        {
            createAt: Date.now(),
            status: 'deletado',
            responsavel:idResponsavel,
            }
    ] 
    statusUser.unshift(newStatusUser);
    try {
        const updateUser= `UPDATE users SET status_perfil = '${statusUser}' where ID_USER ='${idUser}'`
        db.query(updateUser).then((result)=>{
            res.status(200).send("Usuário deletado com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel deletar o usuário: ", error)
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