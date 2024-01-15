const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const uploadImage = require('../cloudinary/cloudinary')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://res-console.cloudinary.com/dbyooxafd/media_explorer_thumbnails/ac6d1139b72529756539ba8bed1fa713/detailed'
    }
})

userSchema.statics.signup = async function (email, username, password, password2, avatar) {
    if (!email || !username || !password || !password2 ) {
        throw Error ('All fields must be filled')
    }
    if(!validator.isEmail(email)) {
        throw Error ('invalid Email')
    }

    const exists = await this.findOne({username})

    if(exists) {
        throw Error ('Username already in use')
    }

    if(!validator.isStrongPassword(password)) {
        throw Error ('Password is not strong enough')
    }

    if(password !== password2) {
        throw Error ('passwords do not match')
    }

    const image = await uploadImage(avatar, username)

    console.log(image.url)

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({
        email, username, password: hash, avatar: image.url
    })

    return user
}


userSchema.statics.login = async function (username, password) {
    if(!username || !password) {
        throw Error ('All fields must be filled')
    }

    const user = await this.findOne({username})

    if(!user) {
        throw Error ('User does not exist')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error ('Incorrect password')
    }

    return user
}


module.exports = mongoose.model('User', userSchema)