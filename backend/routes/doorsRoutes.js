import express from 'express'
import { getAllDoors, getDoorById, createDoor, updateDoor, deleteDoor, getAccessRules, setAccessRule, deleteAccessRule } from '../controllers/doorsController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, getAllDoors)
router.get('/:door_id', verifyToken, getDoorById)
router.post('/', verifyToken, createDoor)
router.put('/:door_id', verifyToken, updateDoor)
router.delete('/:door_id', verifyToken, deleteDoor)

// Access rules routes
router.get('/:door_id/rules', verifyToken, getAccessRules)
router.post('/:door_id/rules', verifyToken, setAccessRule)
router.delete('/rules/:rule_id', verifyToken, deleteAccessRule)

export default router
