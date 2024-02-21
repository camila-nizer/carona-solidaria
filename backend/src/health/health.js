const health = (req, res)=>{
    console.log("entrou aqui")
    res.status(200).send("Backend funcionando uhulll...")
    }

module.exports = {
    health: health
}
 