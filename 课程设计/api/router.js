const express = require('express')
const router = express.Router()
const handler = require('./router_handler.js')

router.post('/read', handler.read)
router.post('/write', handler.write)

module.exports = router
