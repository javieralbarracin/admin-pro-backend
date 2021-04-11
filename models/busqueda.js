const { Schema, model } = require('mongoose');

const BusquedaSchema = Schema({
    nombre:{
        type:String,
        required:true
    }
})

module.exports = model('Busqueda',BusquedaSchema)