/*
    Rutas de usuarios / auth
    host + /api/auth

*/


const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const{crearUsuario, loginUsuario, revalidarToken} = require('../controlers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


router.post(
    '/new', 
    [ //midlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El Correo electrónico es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener 6 carácteres').isLength({min:6}),
        validarCampos
    ],
    crearUsuario
);

router.post('/',
    [ //midlewares
    check('email', 'El Correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener 6 carácteres').isLength({min:6}),
    validarCampos
    ],
    loginUsuario
);

router.get('/renew', validarJWT, revalidarToken );

module.exports = router;