const mongoose = require('mongoose');

//async hace que lo que esté dentro retorne una promesa
const dbConnection = async() => {

    try{
        mongoose.connect(process.env.DB_CNN);
        console.log('DB online');
    
    }catch(error){
        console.log(error);
        throw new Error('Error al iniciar la BBDD');
    }

}

module.exports = {
    dbConnection
}