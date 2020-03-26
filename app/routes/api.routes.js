const express = require('express');
const router  = express.Router(); 
const users   = require('../controllers/user.controller');

router.get('/', users.getUsers);

router.get('/deleteAll', users.deleteAll);

module.exports = router;