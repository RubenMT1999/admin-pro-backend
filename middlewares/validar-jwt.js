const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


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
        //uid del usuario
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


const validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;

    try{
        
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'No tienes privilegios para hacer eso'
            });
        }

        next();


    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

//Para que un usuario pueda actualizar su propio usuario
const validarADMIN_ROLE_o_MismoUsuario = async(req, res, next) => {

    //Si el uid y el id son iguales significa que el usuario
    //quiere modificar su propio perfil
    const uid = req.uid;
    const id = req.params.id;

    try{
        
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){
            next();
        }else{
            return res.status(403).json({
                ok: false,
                msg: 'No tienes privilegios para hacer eso'
            });
        }

        


    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}



module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}