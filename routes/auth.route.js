const auth = require('../middleware/auth');
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user.model')
const express = require('express')
const router = express.Router();

router.get('/current', auth, async (req, res) => {
    const user = await User.findById(req.user._id).selected('-password');
    res.send(user)
});

router.post('/', async (req, res) => {


    //Validando a requisição
    const { error = validate(req.body) }
    if (error)
        return res.status(400).send(error.details[0].message)

    //Procurando um usuário já existente
    let user = await User.findOne({ email: req.body.email })
    if (user)
        return res.status(400).send('Usuário já registrado')

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    })

    user.password = await bcrypt.hash(user.password, 10)

    await user.save()

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    })


})

module.exports = router