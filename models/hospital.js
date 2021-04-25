const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre:{
        type:String,
        required:true,
        unique:true
    },
    img:{
        type:String
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true
    }
}, { collection: 'hospitales' }) 

HospitalSchema.method('toJSON', function(){
    const { _v, _id, ...object } = this.toObject();
    object.hid = _id;
    return object;
})

module.exports = model('Hospital',HospitalSchema)