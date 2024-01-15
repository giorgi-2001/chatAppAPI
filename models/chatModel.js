const mongoose = require ('mongoose')

const Schema = mongoose.Schema

const chatSchema = new Schema({

    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    last_message: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    }
        


}, { timestamps: true })


module.exports = mongoose.model('Chat', chatSchema)