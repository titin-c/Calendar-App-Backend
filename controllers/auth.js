const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async(req, res = response)=>{

    const {email, password }=req.body;


    try {

        let usuario = await Usuario.findOne({email});
        
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario ya existe con ese mismo correo electrónico.'
            })
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guarda base de dato
       await usuario.save();

       //Generar nuestro JWT json web token
       const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUsuario = async(req, res = response)=>{

    const {email, password }=req.body;

    try {
        const usuario = await Usuario.findOne({email});
        
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario NO existe con este email.'
            });
        }
        // confirmar passwords
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta.'
            });
        }

        //Generar nuestro JWT json web token
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    
}

const revalidarToken = async(req, res = response)=>{

    const { uid, name } = req;

    //Generar nuestro JWT json web token
    const token = await generarJWT(uid, name);

    res.json({
        ok:true,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}