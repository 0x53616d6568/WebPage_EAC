import express from 'express'
import { 
  getPreferences, 
  getPreferenceByKey, 
  updatePreference, 
  updateMultiplePreferences,
  deletePreference 
} from '../controllers/preferencesController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, getPreferences)
router.get('/:key', verifyToken, getPreferenceByKey)
router.put('/:key', verifyToken, updatePreference)
router.put('/', verifyToken, updateMultiplePreferences)
router.delete('/:key', verifyToken, deletePreference)

export default router
