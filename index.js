
require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

//Crear el server de express
const app = express()

//Configurar cors
app.use(cors())

//Lectura y parseo del body - poner antes del ruteo
app.use( express.json() );

//Base de Datos
dbConnection();

//pass: Marzo.2020
//dbUser
//cnn: 'mongodb+srv://dbUser:*****@cluster0.6oao3.mongodb.net/hospitaldb?authSource=admin&replicaSet=atlas-l39772-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

//Rutas
app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/hospitales',require('./routes/hospitales'))
app.use('/api/medicos',require('./routes/medicos'))
app.use('/api/login',require('./routes/auth'))
app.use('/api/busquedas',require('./routes/busquedas'))
app.use('/api/uploads',require('./routes/uploads'))



//levantar el server en un puerto especifico
app.listen(process.env.PORT,()=>{
    console.info('Servidor corriendo en el puerto->',process.env.PORT)
})