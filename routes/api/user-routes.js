const router = require('express').Router();
const { getAllUsers, getUserById, createUser, updateUser, addFriend, deleteFriend,  deleteUser } = require('../../controllers/user-controller');

router  
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router  
    .route('/:userId/friends/:friendId')
    .get(addFriend)
    .delete(deleteFriend);

module.exports = router;