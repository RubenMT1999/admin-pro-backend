const { response } = require("express");
const  Medico  = require('../models/medico');

const getMedicos = async(req, resp = response) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img');

    resp.json({
    ok: true,
    medicos
    })
}


const getMedicoById = async(req, resp = response) => {

    const id = req.params.id;

    try{

        const medico = await Medico.findById(id)
                                    .populate('usuario','nombre img')
                                    .populate('hospital','nombre img');

        resp.json({
            ok: true,
            medico
        })

    }catch(error){
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }
}

const crearMedico = async(req, resp = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try{
        const medicoDB = await medico.save();

        resp.json({
            ok: true,
            medico: medicoDB
        });

    }catch(error){
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }

}

const actualizarMedico = async (req, resp = response) => {
    const id = req.params.id;

    try {
        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe un médico con ese Id'
            });
        }

        // Actualizaciones
        const { nombre, hospital } = req.body;

        // Actualizar propiedades del médico encontrado
        medicoDB.nombre = nombre;
        medicoDB.hospital = hospital;

        const medicoActualizado = await medicoDB.save();

        resp.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.error(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};



const borrarMedico = async(req, resp = response) => {

    //el uid es el nombre que le hemos puesto al parametro en la ruta
    const uid = req.params.uid;

    try{

        const medicoDB = await Medico.findById(uid);

        if(!medicoDB){
            console.error('No se encuentra médico con ese ID');
            return resp.status(404).json({
                ok:false,
                msg: 'No se encuentra médico con ese ID'
            });
        }


        const medicoBorrado = await Medico.deleteOne(medicoDB);


       resp.json({
           ok: true,
           msg: 'borrarMedico'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}