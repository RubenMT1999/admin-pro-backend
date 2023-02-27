//Leer FileSystem
const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const borrarImagen = (path) => {

    if(fs.existsSync(path)){
        //Borrar la imagen anterior
        fs.unlinkSync(path);
    }
}




const actualizarImagen = async(tipo, id, nombreArchivo) => {

    //Comprobamos si ya ha subido una imagen
    switch(tipo){
        case 'medicos':
            const medico = await Medico.findById(id);
            if(!medico){
                return false;
            }

            const pathViejo = `./uploads/medicos/${medico.img}`;
            
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if(!hospital){
                return false;
            }

            const pathViejoDos = `./uploads/hospitales/${hospital.img}`;
            
            borrarImagen(pathViejoDos);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario){
                return false;
            }

            const pathViejoTres = `./uploads/usuarios/${usuario.img}`;
            
            borrarImagen(pathViejoTres);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        break;
    }




}


module.exports = {
    actualizarImagen
}