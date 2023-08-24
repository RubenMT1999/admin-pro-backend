/*
ruta: '/api/hospitales' 
 */

/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
} = require('../controllers/hospitales');

const router = Router();

router.get( '/', getHospitales );

//el segundo parametro son los middlewares, serán los validadores
//primero hacemos los checks y luego el middleware personalizado, pue sen el
//necesitamos que se hayan ejecutado antes los checks
router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ], 
    crearHospital );


router.put( '/:id',
    [
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarJWT,
        validarCampos
    ],
    actualizarHospital);


router.delete( '/:uid', validarJWT, borrarHospital);




module.exports = router;