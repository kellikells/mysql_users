const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// const authController = require('../controllers/auth');

// do not have to put '/auth/register' because from <app.js> it is sending it from '/auth' already 
router.post('/register', authController.register);



module.exports = router;