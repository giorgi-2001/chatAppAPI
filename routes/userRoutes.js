const express = require('express')
const {signup, login, getUsers } = require('../controllers/userControllers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)


router.use(requireAuth)

router.get('/users', getUsers)

module.exports = router