const router = require('express').Router();
const userController = require('../controllers/user.controllers');

router.get('/users', userController.getUser);

module.exports = router;