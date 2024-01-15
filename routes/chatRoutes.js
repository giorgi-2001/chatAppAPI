const express = require('express')
const { accessChat, getAllChats } = require('../controllers/chatControllers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.post('/', accessChat)

router.get('/', getAllChats)

module.exports = router