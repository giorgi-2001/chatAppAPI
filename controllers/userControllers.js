const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (id) => {
    const token = jwt.sign({id}, process.env.SECRET, { expiresIn: '3d' })
    return token
}

const signup = async (req, res) => {

    const {email, username, password, password2, avatar} = req.body
    
    try {
        const user = await User.signup(email, username, password, password2, avatar)
        const token = createToken(user._id)
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token
        })
    } catch(error) {
        res.status(400).json({error: error.message})
    }

}

const login = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.login(username, password)
        const token = createToken(user._id)
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token
        })
    } catch(error) {
        res.status(400).json({error: error.message})
    }
    
}

const getUsers = async (req, res) => {

    const { _id: myId } = req.user

    const users = await User.find({_id: { $ne: myId }}).select("-password").lean()

    res.status(200).json(users)
}

module.exports = {signup, login, getUsers}