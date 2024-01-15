const mongoose = require ('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema ({

    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    content: {
        type: String,
        required: true
    },

    hidden: {
        type: Boolean,
        default: false
    }

}, {timestamps: true })


module.exports = mongoose.model('Message', messageSchema)


