const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {
    getMessages, sendMessage, deleteMessage, updateMessage
} = require('../controllers/messageControllers')

const router = express.Router()

router.use(requireAuth)

router.get('/', getMessages)
router.post('/', sendMessage)
router.delete('/:id', deleteMessage)
router.patch('/:id', updateMessage)


module.exports = router