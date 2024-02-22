const db= require("../database");
const {v4: uuidv4}= require("uuid")


const findByCPF=(url)=>{
    return new Promise((resolve, reject) => {
        const pesquisa= `SELECT * FROM users where url = '${url}'`
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
    const vinculoFMP= req.body.vinculoFMP
    const matricula= req.body.matricula
    const userType = req.body.userType
    const CNH = req.body.CNH
    const statusUser=  [
        {
        createAt: Date.now(),
        status: 'ativo',
        }
    ]
    const telefone= req.body.telefone

    findByCPF(cpf).then((found)=> {
        if (!found){
            const createUser= `INSERT INTO users (idUser, nome, cpf, nasc, vinculoFMP, matricula, userType, CNH, statusUser, telefone) VALUES (
                    '${idUser}',
                    '${nome}',
                    '${cpf}',
                    '${nasc}',
                    '${vinculoFMP}',
                    '${matricula}',
                    '${userType}',
                    '${CNH}',
                    ARRAY [${statusUser}],
                    '${telefone}'
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
    const findUser= `SELECT * FROM users where idUser = '${idUser}'`
    db.query(findUser).then((result)=>{
        res.status(200).send(result)
    })
}



const getAllUsers = (req, res)=>{
    const findAllUsers= `SELECT * FROM users`
    db.query(findAllUsers).then((result)=>{
        res.status(200).send(result)
    })
}

const getStatusUser = (req, res)=>{
    idUser = req.query.idUser
    const findStatusUser= `SELECT statusUser FROM users where idUser= '${idUser}' `
    db.query(findStatusUser).then((result)=>{
        res.status(200).send(result)
    })
}


const deleteUser = (req, res)=>{
    const idUser = req.body.idUser
    const newStatusUser= req.body.newStatusUser
    let statusUser= getStatusUser(idUser)
    
    statusUser.unshift(newStatusUser);



    try {
        const updateUser= `UPDATE users SET statusUser= '${statusUser}' where idUser ='${idUser}'`
        db.query(updateUser).then((result)=>{
            res.status(200).send("Usuário deletado com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel deletar o usuário: ", error)
    }
                
}

const updateUser = (req, res)=>{
    // TODO
}


module.exports = {
    createUser: createUser,
    getUser: getUser,
    getAllUsers:getAllUsers, //de adm pegar todos os usuários
    updateUser: updateUser,
    deleteUser: deleteUser,
}