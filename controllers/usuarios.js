const {response} = require('express');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('..//helpers/jwt');

const Usuario = require('../models/usuario');

//-------------------------------------------------------------
//-------------------------------------------------------------

const getUsuarios = async(req, resp) => {

    //parametro para paginación
    const desde = Number(req.query.desde) || 0;

    //queremos hacer dos tareas que son asincronas.
    //de este modo hacemos que se ejecutan simultaneamente
    //y desestructuramos para obtener el valor de cada promesa
    const [ usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
                .skip(desde)
                .limit(5),

        Usuario.countDocuments()
    ])

    resp.json({
        ok: true,
        usuarios: usuarios,
        total
        //uid configurado en el middleware validarJWT
        /* uid: req.uid */
    });
}

const crearUsuarios = async(req, resp = response) => {

    //Necesito esperarme a que esta acción/promesa termine antes de que
    //nos devuelva la respuesta, por ello usamos asyn y await

    const { email, password, nombre } = req.body;

    try{
        //Comprobar si ya existe ese email
        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return resp.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        //Crear el nuevo usuario
        const usuario = new Usuario(req.body);
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guardar usuario
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id);

        resp.json({
            ok: true,
            usuario: usuario,
            token: token
        })

    }catch(error){
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}



const actualizarUsuarios = async(req, resp = response) => {

    const uid = req.params.id

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return resp.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }

        //Actualizaciones
        const {password, google, email, ...campos} = req.body;

        //para que no choque con el error de email unico
        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email: email});
            if(existeEmail){
                return resp.status(400).json({
                    ok: false,
                    message: 'Ya existe un usuario con ese email'
                })
            }
        }

        if(!usuarioDB.google){
            campos.email = email;
        }else if(usuarioDB.email !== email){
            return resp.status(400).json({
                ok: false,
                message: 'Los usuarios de Google no pueden cambiar su correo'
            })
        }
        
        //el parámetro { new: true } 
        // controla si deseas recibir el documento actualizado como resultado de la operación.
        // Si se establece en true, obtendrás el documento actualizado; si se establece en false, 
        //obtendrás el documento antes de la actualización.
        const usuarioActualizado = await Usuario.findByIdAndUpdate(  uid, campos, {new: true} );


        resp.json({
            ok: true,
            usuario: usuarioActualizado
        })

    }catch(error){
        console.error(error);
        resp.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }
}



const borrarUsuario = async(req, resp = response) =>{

    //el uid es el nombre que le hemos puesto al parametro en la ruta
    const uid = req.params.uid;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            console.error('No se encuentra usuario con ese ID');
            return resp.status(404).json({
                ok:false,
                msg: 'No se encuentra usuario con ese ID'
            });
        }


        const usuarioBorrado = await Usuario.deleteOne(usuarioDB);

        resp.json({
            ok: true,
            usuario: usuarioBorrado
        })


    }catch(error){
        console.error(error);
        resp.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}



module.exports = {
    getUsuarios, crearUsuarios, actualizarUsuarios,borrarUsuario
}