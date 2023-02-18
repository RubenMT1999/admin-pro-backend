const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('..//helpers/jwt');



const login = async(req,resp = response) => {

    const { email, password } = req.body;

    try{

        //Verificar contraseña
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return resp.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }


        //Verificar contraseña
        //Hashea la password pasada por body y mira si hacen match con la
        //codificada en la base de datos.
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return resp.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        resp.json({
            ok:true,
            token: token
        })

    }catch(error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}



module.exports = {
    login
}