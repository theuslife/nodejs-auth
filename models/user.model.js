const config = require('require')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken');
const { mongoose } = require('mongoose');

//Schema -> Data bank
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    isAdmin: Boolean

})

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin
        },
        config.get('myprivatekey')
    ); //get the private key from the config file -> environment variable
    return token;
}

//Model
const User = mongoose.model('User', UserSchema)

/**
 * Valida os dados do usuário
 * @param {dados de login} user - Email, senha e nome
 */
const validateUser = (user) => {

    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    }

    return Joi.validate(user, schema)

}

exports.User = User;
exports.validade = validateUser;
