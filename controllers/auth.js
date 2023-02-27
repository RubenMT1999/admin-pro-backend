const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('..//helpers/jwt');
const {googleVerify} = require('..//helpers/google-verify');



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


const googleSignIn = async(req, resp = response) => {

    try{
        const { email, name, picture } = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else{
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        resp.json({
            ok: true,
            email, name, picture,
            token
        });

        
    }catch(error){
        resp.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });
    }
    


    
}




module.exports = {
    login,
    googleSignIn
}