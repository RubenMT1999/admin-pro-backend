const { response } = require("express");

const Hospital = require('../models/hospital');


const getHospitales = async (req, resp = response) => {

    const hospitales = await Hospital.find()
                                      .populate('usuario','nombre');

    resp.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, resp = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try{
        const hospitalDB = await hospital.save();

        resp.json({
            ok: true,
            hospital: hospitalDB
        });

    }catch(error){
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }

    
}

const actualizarHospital = async (req, resp = response) => {

    const id = req.params.id;

    //como pasamos x el middleware del jwt tenemos acceso al uid (user id)
    const uid = req.uid;

    try{

        const hospital = await Hospital.findById(id);

        if(!hospital){
            resp.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});

        resp.json({
            ok: true,
            msg: 'actualizarHospital',
            hospital: hospitalActualizado
        });

    }catch(error){
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}


const borrarHospital = async(req, resp = response) => {

     //el uid es el nombre que le hemos puesto al parametro en la ruta
     const uid = req.params.uid;

     try{
 
         const hospitalDB = await Hospital.findById(uid);
 
         if(!hospitalDB){
             console.error('No se encuentra hospital con ese ID');
             return resp.status(404).json({
                 ok:false,
                 msg: 'No se encuentra hospital con ese ID'
             });
         }
 
 
         const hospitalBorrado = await Hospital.deleteOne(hospitalDB);
 

        resp.json({
            ok: true,
            msg: 'borrarHospital'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}