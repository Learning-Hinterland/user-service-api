const router = require('express').Router();
const userController = require('../controllers/user.controllers');

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);

module.exports = router;