import express from 'express'
import multer from 'multer'
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, assignManager, enrollFace } from '../controllers/usersController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', verifyToken, getAllUsers)
router.get('/:user_id', verifyToken, getUserById)
router.post('/', verifyToken, createUser)
router.put('/:user_id', verifyToken, updateUser)
router.delete('/:user_id', verifyToken, deleteUser)
router.put('/:user_id/manager', verifyToken, assignManager)
router.post('/:user_id/face-enrollment', verifyToken, upload.single('file'), enrollFace)

export default router
