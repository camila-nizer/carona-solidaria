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

const finishRace = (req, res)=>{
    const idDriver = req.query.idDriver
    
    const corridas= getAllRides(idDriver)
    const datenow= Date.now()
    

    corridas.forEach(item => {
        if (item.status[0]!= 'finished' && datenow.isAfter(item.Date)){

            const newStatusFinished= getStatusUser(item.idCorrida)

            const rideStatus = [
                {
                createAt: Date.now(),
                status: 'finished',
                responsavel: idDriver,
                }
            ]
            newStatusFinished.unshift(rideStatus);
            let atualizarCorrida = `UPDATE corrida SET Status_Corrida= '${newStatusFinished}'  where ID_CORRIDA ='${item.idCorrida}'`

            try {
                db.query(atualizarCorrida).then((result)=>{
                    res.status(200).send("Dados atualizados com sucesso")
                })
                
            } catch (error) {
                res.status(400).send("Não foi possivel atualizar: ", error)
            }

        }
    });

}


const getStatusRide = (req, res)=>{
    const idCorrida= req.query.idCorrida
    const findStatusUser= `SELECT Status_Corrida FROM users where ID_CORRIDA= '${idCorrida}' `
    db.query(findStatusUser).then((result)=>{
        res.status(200).send(result)
    })
}


const getAllRides = (req, res)=>{
    const idDriver = req.query.idDriver
    const findAllRides =  `SELECT * FROM corrida where ID_MOTORISTA = '${idDriver}`
    db.query(findAllRides).then((result)=>{
        res.status(200).send(result)
    })
}

const getAllRidesADM = (req, res)=>{
    const idDriver = req.query.idDriver
    const findAllRides =  `SELECT * FROM corrida`
    db.query(findAllRides).then((result)=>{
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
const updateRide = (req, res)=>{
    const idRide = req.body.idRide
    const status= req.body.status
    try {
        const updateRide= `UPDATE corrida SET statusRide= '${status}' where idRide ='${idRide}'`
        db.query(updateRide).then((result)=>{
            res.status(200).send("Carona deletada com sucesso.")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel deletar a carona: ", error)
    }              
}


module.exports = {
    createRide:createRide,
    getActiveRide: getActiveRide,
    getAllRides:getAllRides,
    updateRide:updateRide,
    driverAceptRide:driverAceptRide,
    getAllRidesADM:getAllRidesADM,
    finishRace:finishRace
}