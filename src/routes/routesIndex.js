const express = require('express')
const router = express.Router()

// Routing fot game informations (available games, description of the games...)
router.use('/api', require('./api'))

// Export Router
module.exports = router