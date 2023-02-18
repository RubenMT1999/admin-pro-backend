
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },

});


UsuarioSchema.method('toJSON', function() {
    //tenemos el v, el id, y luego el resto del objeto
    //retornamos el object por lo que hemos descartado el id y v.
    //de esta forma al realizar la peticion no aparecerá el __v ni _id.
    const {__v, _id, password, ...object} = this.toObject();

    //establecemos el id pero quitandole el _
    object.uid = _id;
    return object
})

module.exports = model('Usuario', UsuarioSchema);