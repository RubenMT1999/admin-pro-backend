//require es como el import
const express = require('express');

//para leer las variables de entorno de .env y lo establece
//en las variables de entorno de node.
require('dotenv').config();

var cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear servidor de express
const app = express();

//configurar CORS
//Use es un middleware que se va a ejecutar desde esta línea
//para las lineas de abajo. Cada vez que se haga un petición a db
//va a pasar por este punto y se tendrá el cors configurado
app.use(cors());

app.listen(4200, function () {
    console.log('CORS-enabled web server listening on port 4200')
  })

// Carpeta pública
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Rutas
app.use( '/api/usuarios',  require('./routes/usuarios'));
app.use( '/api/hospitales',  require('./routes/hospitales'));
app.use( '/api/medicos',  require('./routes/medicos'));
app.use( '/api/login',  require('./routes/auth'));
app.use( '/api/todo',  require('./routes/busquedas'));
app.use( '/api/upload',  require('./routes/uploads'));



//el listen tiene el puerto y un callback para cuando se levante el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})