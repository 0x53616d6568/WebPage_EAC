import express from 'express'
import { getLogs, getLogStats } from '../controllers/logsController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, getLogs)
router.get('/stats', verifyToken, getLogStats)

export default router
