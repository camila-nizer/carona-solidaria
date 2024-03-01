const db= require("../database");
const {v4: uuidv4}= require("uuid")


const createRide = (req, res)=>{
    const idRide = uuidv4();
    const idDriver = req.body.idDriver //ID motorista
    const idcarro= req.body.idcarro //ID do carro usado
    const departureLocation = req.body.departureLocation //Bairro de partida (bairro)
    const arrivalPlace = req.body.arrivalPlace //Bairo de chegada (bairro)
    const dateRide = req.body.dateRide //data da viagem
    const shift = req.body.shift    //Turno (matutino, vespertino, noturno)
    const quant_vaga=req.body.quant_vaga // quantidade de vagas ofertadas
    const vagas_disponiveis=req.body.vagas_disponiveis //vagas disponíveis
    const rideStatus = [
        {
        createAt: Date.now(),
        status: 'ativo',
        responsavel: idRide,
        }
    ]
    try {
        const createRide= `INSERT INTO corrida (ID_CORRIDA, ID_MOTORISTA, ID_CARRO,  Bairro_Partida, Bairro_Chegada, Data, Turno, Quant_Vaga, Vagas_disponiveis, Status_Corrida) VALUES (
            '${idRide}' , '${idDriver}', '${idcarro}', '${departureLocation}', '${arrivalPlace}',  '${dateRide}', '${shift}', '${quant_vaga}', '${vagas_disponiveis}',ARRAY [${rideStatus}])`
        db.query(createRide).then((result)=>{
            res.status(200).send("Carona criada com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel criar a carona: ", error)
    }
 

}

const getActiveRide = (req, res)=>{
    const idDriver = req.query.idDriver
    const findActiveRide = `SELECT * FROM corrida where ID_MOTORISTA = '${idDriver}' and Status_Corrida.status[0] = 'ativo' `
    db.query(findActiveRide).then((result)=>{
        res.status(200).send(result)
    })
}

const finishRace = (req, res)=>{    //TODO: revisar função para conferir se pega a corrida certa
    const idDriver = req.query.idDriver
    
    const corridas= getAllRidesUser(idDriver)
    const datenow= Date.now()
    

    corridas.forEach(item => {
        if (item.status[0]!= 'finished' && datenow.isAfter(item.Date)){
            try {
                insertNewStatusRide(idDriver, "finished", idDriver, item.idcorrida)
            } catch (error) {
                res.status(400).send("Não foi possivel finalizar a corrida: ", error)
            }

        }
    });

}


const insertNewStatusRide=(idUser, status,  responsavel, idcorrida)=>{ //VERIFICAR SE QUERY FUNCIONA
    return new Promise((resolve, reject) => {
        const id_corrida_status= uuidv4();
        const id_motorista = idUser
        const statusCorrida = status
        const responsavelUser= responsavel 

    const createStatusRide=`INSERT INTO corrida_status ("id_corrida_status", 
            "id_motorista", 
            "id_corrida",
            "status_corrida",
            "responsável",
            "created_at") 
            VALUES (
            '${id_corrida_status}',
            '${id_motorista}',
            '${idcorrida}',
            '${statusCorrida}',
            '${responsavelUser}',
            NOW())` 

    db.query(createStatusRide).then((result)=>{
        return true
    })
    })
}


const getAllRidesUser = (req, res)=>{ //TUDO OK
    const idDriver = req.query.idDriver
    try {
        const findAllRidesUser =  `SELECT 
        corrida.id_corrida as corrida,
        corrida.id_motorista as motorista,
        users.nome as nome_motorista,
        corrida.id_carro as idCarro,
        corrida.bairro_partida as bairro_partida,
        corrida.bairro_chegada as bairro_chegada,
        corrida.data as data_corrida,
        corrida.turno as turno_corrida,
        corrida.quant_vaga as quantidade_vaga,
        corrida.vagas_disponiveis as vagas_disponiveis,
        json_agg(status ORDER BY status.created_at DESC) as status_array
        from corrida
        INNER JOIN corrida_status status on corrida.id_corrida = status.id_corrida
        INNER JOIN users on corrida.id_motorista = users.id_user
        where corrida.id_motorista = '${idDriver}'
        GROUP BY corrida, nome
        `
    db.query(findAllRidesUser).then((result)=>{
        res.status(200).send(result)
    })
        
    } catch (error) {
        res.status(400).send("Não foi localizar todas as corridas: ", error)
    }
} 

const getActiveRidesUser = (req, res)=>{ //TODO PEGAR SÓ CORRIDAS ATIVAS --CONFERIR SE STATUS.STATUS_CORRIDA != DELETADO FUNCIONA PARA ULTIMA CORRIDA
    const idDriver = req.query.idDriver
    try {
        const findAllRidesUser =  `SELECT 
        corrida.id_corrida as corrida,
        corrida.id_motorista as motorista,
        users.nome as nome_motorista,
        corrida.id_carro as idCarro,
        corrida.bairro_partida as bairro_partida,
        corrida.bairro_chegada as bairro_chegada,
        corrida.data as data_corrida,
        corrida.turno as turno_corrida,
        corrida.quant_vaga as quantidade_vaga,
        corrida.vagas_disponiveis as vagas_disponiveis,
        json_agg(status ORDER BY status.created_at DESC) as status_array
        from corrida
        INNER JOIN corrida_status status on corrida.id_corrida = status.id_corrida
        INNER JOIN users on corrida.id_motorista = users.id_user
        where corrida.id_motorista = '${idDriver}'
        and
        status.status_corrida != '%deletado%'
        GROUP BY corrida, nome
        `
    db.query(findAllRidesUser).then((result)=>{
        res.status(200).send(result)
    })
        
    } catch (error) {
        res.status(400).send("Não foi localizar todas as corridas: ", error)
    }
    
}

const getAllRidesADM = (req, res)=>{ //TUDO OK

    try {
        const findAllRidesAdm =  `SELECT 
        corrida.id_corrida as corrida,
        corrida.id_motorista as motorista,
        users.nome as nome_motorista,
        corrida.id_carro as idCarro,
        corrida.bairro_partida as bairro_partida,
        corrida.bairro_chegada as bairro_chegada,
        corrida.data as data_corrida,
        corrida.turno as turno_corrida,
        corrida.quant_vaga as quantidade_vaga,
        corrida.vagas_disponiveis as vagas_disponiveis,
        json_agg(status ORDER BY status.created_at DESC) as status_array
        from corrida
        INNER JOIN corrida_status status on corrida.id_corrida = status.id_corrida
        INNER JOIN users on corrida.id_motorista = users.id_user
        GROUP BY corrida, nome`
        db.query(findAllRidesAdm).then((result)=>{
            res.status(200).send(result)
        })
        
    } catch (error) {
        res.status(400).send("Não foi localizar todas as corridas (Administrador): ", error)
    }
    db.query(findAllRidesAdm).then((result)=>{
        res.status(200).send(result)
    })
}

const driverAceptRide = (req, res)=>{
    const idRide = req.body.id
    const status= req.body.status
    // try {
    //     const updateRide= `UPDATE rides SET status= '${status}' where idRide ='${idRide}'`
    //     db.query(updateRide).then((result)=>{
    //         res.status(200).send("Carona atualizada com sucesso")
    //     })
        
    // } catch (error) {
    //     res.status(400).send("Não foi possivel atualizar a carona: ", error)
    // }
                
}
const deleteRide = (req, res)=>{
    const idRide = req.body.idRide
    const id_user= req.body.id_user
    const responsavel= req.body.responsavel
     try {
        insertNewStatusRide(id_user, "deletado",  responsavel, idRide)
        
    } catch (error) {
        res.status(400).send("Não foi possivel deletar a carona: ", error)
    }              
}


module.exports = {
    createRide:createRide,
    getActiveRide: getActiveRide,
    getAllRidesUser:getAllRidesUser,
    deleteRide:deleteRide,
    driverAceptRide:driverAceptRide,
    getAllRidesADM:getAllRidesADM,
    finishRace:finishRace,
    getActiveRidesUser:getActiveRidesUser
}