/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');

const { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE,
        validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT, getUsuarios );

//el segundo parametro son los middlewares, serán los validadores
//primero hacemos los checks y luego el middleware personalizado, pue sen el
//necesitamos que se hayan ejecutado antes los checks
router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ], 
    crearUsuarios );


router.put( '/:id',
    [
        validarJWT,
        validarADMIN_ROLE_o_MismoUsuario,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
     actualizarUsuarios);


router.delete( '/:uid', validarJWT, validarADMIN_ROLE, borrarUsuario);


     




module.exports = router;