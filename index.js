//require es como el import
const express = require('express');

//para leer las variables de entorno de .env y lo establece
//en las variables de entorno de node.
require('dotenv').config();

var cors = requier('cors');

const { dbConnection } = require('./database/config');

//Crear servidor de express
const app = express();

//configurar CORS
//Use es un middleware que se va a ejecutar desde esta línea
//para las lineas de abajo. Cada vez que se haga un petición a db
//va a pasar por este punto y se tendrá el cors configurado
app.use(cors());

//Base de datos
dbConnection();

//Rutas
app.get( '/', (req, resp) => {

    resp.json({
        ok: true,
        msg: 'Hola Mundo',
    })

});

//el listen tiene el puerto y un callback para cuando se levante el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})