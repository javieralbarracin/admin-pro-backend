const { response } = require('express');
const path  = require('path'); //esto esta incluido en node
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async (req,res=response)=>{
    
    const tipo = req.params.tipo;
    const id = req.params.id;

    //Validar tipos
    const tiposValidos = [ 'hospitales', 'medicos', 'usuarios' ]
    if(! tiposValidos.includes(tipo)){
        res.status(400).json({
            ok:true,
            msg:'no es un medico, usuario u hospital'
        });        
    }
    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:true,
            msg:'No files were uploaded.'
        });        
    }

    //Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.'); //nombre.1.2.3.jpg
    const extensionArchivo = nombreCortado[ nombreCortado.length-1 ];
    
    //Validar extencion
    const extensionValida = [ 'png','jpg','jpeg','gif'];

    if(!extensionValida.includes(extensionArchivo)){
        return res.status(400).json({
            ok:true,
            msg:'Extensiones permitidas: png, jpg, jpeg, gif'
        }); 
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;
    // Mover la imagen
    file.mv(path, (err)=> {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen'
            }); 
        }
    
        // Actualizar imagen en la BD
        actualizarImagen( tipo, id, nombreArchivo);    
        //console.info('resultado de la ejecucion',result)
        res.json({
            ok:true,
            msg:'Archivo subido',
            nombreArchivo
        });
    });
}

const retornaImagen = (req,res=response)=>{
    const tipo = req.params.tipo;
    const imagen = req.params.imagen;

    let pathImg = '';
    
    pathImg = path.join( __dirname, `../uploads/${ tipo }/${ imagen }`);
    // imagen por defecto
    if ( fs.existsSync(pathImg) ){        
        res.sendFile( pathImg );
    }else{
        pathImg = path.join( __dirname, `../uploads/defaults/500.jpeg`);
        res.sendFile( pathImg );
    }


}

module.exports = {
    fileUpload, retornaImagen
}