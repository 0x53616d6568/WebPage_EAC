import express from 'express'
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/usersController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, getAllUsers)
router.get('/:user_id', verifyToken, getUserById)
router.post('/', verifyToken, createUser)
router.put('/:user_id', verifyToken, updateUser)
router.delete('/:user_id', verifyToken, deleteUser)

export default router
