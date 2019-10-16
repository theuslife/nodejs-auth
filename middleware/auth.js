import jwt from 'jsonwebtoken';
import config from 'config'

module.exports = (req, res, next) => {

    //Pega o token do header se tiver
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    //Se o token não foi achado, returna uma resposta sem ir ao próximo middleware
    if (!token)
        return res.status(401).send('Acesso negado. Token não provido')
    try {

        //Se foi verificado token, então configura o req.user e vai para o próximo middleware
        const decoded = jwt.verify(token, config.get('myprivatekey'))
        req.user = decoded;
        next()

    } catch (error) {

        //Caso seja inválido
        return res.status(400).send('Token Inválido')

    }


}