const express = require('express');
var cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

//Crear servidor de Express
const app = express();

//BBDD
dbConnection();

//CORS
app.use(cors());

// Lectura y Parseo del body
app.use( express.json() );

//Directorio público
app.use(express.static('public'));

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Escuchar peticiones
app.listen(process.env.PORT, ()=> {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
})