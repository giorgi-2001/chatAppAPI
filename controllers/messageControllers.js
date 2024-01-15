const Message = require('../models/messageModel')
const Chat = require('../models/chatModel')

// get all messages

const getMessages = async (req, res) => {
    const { chat } = req.query

    const myChat = await Chat.findById(chat).lean().exec()
    const isMyChat = myChat.users.find(user => 
        user._id.toString() === req.user._id.toString())

    if(!isMyChat) {
        return res.status(401).json({error: 'Chat does not belong to you'})
    }

    const messages = await Message.find({ chat }).sort({ createdAt: -1 }).limit(100).lean()
    res.status(200).json(messages)
}


// create message

const sendMessage = async (req, res) => {

    const { _id } = req.user
    const { chat, content } = req.body

    try {
        const message = await Message.create({
            chat, content, sender: _id
        })
        const updatedChat = await Chat.findById(chat)
        updatedChat.last_message = message._id
        await updatedChat.save()
        res.status(200).json(message)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// delete message

const deleteMessage = async (req, res) => {
    const { id } = req.params

    try { 
        const message = await Message.findById(id)

        const chat = await Chat.findById(message.chat).lean().exec()
        const myChat = chat.users.find(user => 
            user._id.toString() === req.user._id.toString())

        if(!myChat) {
            return res.status(401).json({error: 'Chat does not belong to you'})
        }

        if(message.sender._id.toString() === req.user._id.toString()){
            await message.deleteOne()
            res.status(200).json(message)
        } else {
            message.hidden = true
            await message.save()
            res.status(200).json(message)
        }

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// update message

const updateMessage = async (req, res) => {
    const { id } = req.params
    const { content } = req.body

    try {
        const message = await Message.findById(id)

        const chat = await Chat.findById(message.chat).lean().exec()
        const myChat = chat.users.find(user => 
            user._id.toString() === req.user._id.toString())

        if(!myChat) {
            return res.status(401).json({error: 'Chat does not belong to you'})
        }

        if(message.sender._id.toString() === req.user._id.toString()){
            await message.updateOne({ content })
            res.status(200).json(message)
        } else {
            return res.status(401).json({error: 'Message does not belong to you'})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


module.exports = { getMessages, sendMessage, deleteMessage, updateMessage}