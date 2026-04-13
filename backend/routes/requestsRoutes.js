import express from 'express'
import { getMyRequests, getAllRequests, getRequestById, createRequest, reviewRequest } from '../controllers/requestsController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/me', verifyToken, getMyRequests)
router.get('/', verifyToken, getAllRequests)
router.get('/:request_id', verifyToken, getRequestById)
router.post('/', verifyToken, createRequest)
router.patch('/:request_id/review', verifyToken, reviewRequest)

export default router
