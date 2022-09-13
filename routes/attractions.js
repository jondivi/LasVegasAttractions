const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const attractionsController = require('../controllers/attractions') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, attractionsController.getAttractions)

router.get('/logout', authController.logout)

router.post('/createAttraction', attractionsController.createAttraction)

router.put('/markComplete', attractionsController.markComplete)

router.put('/markIncomplete', attractionsController.markIncomplete)

router.delete('/deleteAttraction', attractionsController.deleteAttraction)

module.exports = router