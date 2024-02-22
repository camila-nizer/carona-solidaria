const db= require("../database");
const {v4: uuidv4}= require("uuid")


const createRide = (req, res)=>{
    const idRide = uuidv4();
    const idDriver = req.body.idDriver //ID motorista
    const departureLocation = req.body.departureLocation //Local de partida (bairro)
    const arrivalPlace = req.body.arrivalPlace //Local de chegada (bairro)
    const dateRide = req.body.dateRide //data da viagem
    const shift = req.body.shift    //Turno (matutino, vespertino, noturno)
    const rideStatus = [
        {
        createAt: Date.now(),
        status: 'ativo',
        }
    ]
    try {
        const createRide= `INSERT INTO rides (idRide, idDriver, departureLocation, arrivalPlace, dateRide, shift, rideStatus) VALUES ('${idRide}' , '${idDriver}', '${departureLocation}', '${arrivalPlace}',  '${dateRide}', '${shift}',ARRAY [${rideStatus}])`
        db.query(createRide).then((result)=>{
            res.status(200).send("Carona criada com sucesso")
        })
        
    } catch (error) {
        res.status(400).send("Não foi possivel criar a carona: ", error)
    }
 

}

const getActiveRide = (req, res)=>{
    const idRide = req.query.idRide
    const statusRide = 'ativo'
    const findActiveRide = `SELECT * FROM rides where idRide = '${idRide}' and statusRide.status[0] = '${statusRide}' `
    db.query(findActiveRide).then((result)=>{
        res.status(200).send(result)
    })
}


const getAllRides = (req, res)=>{
    const findAllRides = `SELECT * FROM rides where idRide = '${idRide}'`
    db.query(findAllRides).then((result)=>{
        res.status(200).send(result)
    })
}

const userAceptRide = (req, res)=>{
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
        const updateRide= `UPDATE rides SET statusRide= '${status}' where idRide ='${idRide}'`
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
    userAceptRide:userAceptRide,
}