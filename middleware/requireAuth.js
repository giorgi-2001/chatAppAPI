const jwt = require ('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {

    const { authorization } = req.headers

    if(!authorization) {
        return res.status(401).json({error: 'Authorization Token Required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, process.env.SECRET)
        req.user = await User.findById(id).select('_id')
        next()
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = requireAuth