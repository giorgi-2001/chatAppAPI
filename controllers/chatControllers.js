// access chat (or create)
// fetch all chats
// remove chat and its messages

const mongoose = require('mongoose')

const Chat = require('../models/chatModel')
const User = require('../models/userModel')


const accessChat = async (req, res) => {

    const { userId } = req.body

    if(!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({error: 'You have to provide user id'})
    }

    const user = await User.findById(userId).select('_id')

    if(!user) {
        return res.status(400).json({error: 'User was not found'})
    }

    const isChat = await Chat.find({
        $and: [
            {users: {$elemMatch: { $eq: req.user._id}}},
            {users: {$elemMatch: { $eq: userId}}}
        ]
    }).populate('users', '-password').populate('last_message', '_id content sender')

    if(isChat?.length > 0) {
        const chat = isChat[0]

        const myChat = await Chat.findById(chat._id).populate('last_message').populate('users', '-password')
        res.status(200).json(myChat)
    } else {
        const chat = await Chat.create({
            users: [
                req.user._id, userId
            ]
        })

        const myChat = await Chat.findById(chat._id).populate('users', '-password').lean()

        res.status(200).json(myChat)
    }

}


const getAllChats = async (req, res) => {

    try {
        const chats = await Chat.find({
            users: {$elemMatch: { $eq: req.user._id}}
        }).populate('users', '-password').populate('last_message')
        res.status(200).json(chats)
    } catch (error) {
        console.log(error)
    }
}


module.exports = { accessChat, getAllChats }