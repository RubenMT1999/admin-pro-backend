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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
} = require('../controllers/medicos');

const router = Router();

router.get( '/',validarJWT, getMedicos);

//el segundo parametro son los middlewares, serán los validadores
//primero hacemos los checks y luego el middleware personalizado, pue sen el
//necesitamos que se hayan ejecutado antes los checks
router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del medico es necesario').not().isEmpty(),
        check('hospital','El hospital id es necesario').isMongoId(),
        validarCampos
    ], 
    crearMedico );


router.put( '/:id',
    [

    ],
    actualizarMedico);


router.delete( '/:uid', validarJWT, borrarMedico);

router.get('/:id',validarJWT,getMedicoById);


module.exports = router;