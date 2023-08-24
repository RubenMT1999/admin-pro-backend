const jwt = require('jsonwebtoken');


const validarJWT = (req, resp, next) => {

    //Leer Token
    const token = req.header('x-token');

    if(!token){
        return resp.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try{
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        //ahora en el controler tendremos un nuevo request
        req.uid = uid;
        
        //para asegurarnos que esta parte del codigo se ha ejecutado
        next();
    }catch(error){
        return resp.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }



   
}






module.exports = {
    validarJWT
}