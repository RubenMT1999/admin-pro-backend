
const { Schema, model } = require('mongoose');

//collection para cambiarle el nombre a la tabla
const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'hospitales' });


HospitalSchema.method('toJSON', function() {
    const {__v,  ...object} = this.toObject();
    return object;

})

module.exports = model('Hospital', HospitalSchema);