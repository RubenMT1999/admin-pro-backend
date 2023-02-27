const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const path = require('path');
const fs = require('fs');


const fileUpload = (req, resp = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];
    if(!tiposValidos.includes(tipo)){
        return resp.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital'
        });
    }

    //verificar que se manda un archivo
    //en postman -> form data -> Key de tipo File
    //podemos usar files gracias al middleware expressFileUpload de routes
    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
      }

    //Procesar la imagen...
      const file = req.files.imagen;

      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length-1];

    //Validar extesion
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if(!extensionesValidas.includes(extensionArchivo)){
        return resp.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover la imagen
    file.mv(path, (err) => {
        if (err){
            return resp.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }


    //Actualizar base de datos
    actualizarImagen(tipo, id, nombreArchivo);

        resp.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
  });
}


const retornaImagen = (req, resp = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    // imagen por defecto
    if(fs.existsSync(pathImg)){
        resp.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname,`../uploads/noImage.png`);
        resp.sendFile(pathImg);
    }

    

}




module.exports = {
    fileUpload,
    retornaImagen
}