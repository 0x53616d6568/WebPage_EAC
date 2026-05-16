import express from 'express'
import { login, requestPasswordReset, resendVerificationEmail, devResetAdminPassword } from '../controllers/authController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/password-reset-request', requestPasswordReset)
router.post('/resend-verification-email', verifyToken, resendVerificationEmail)
// ⚠️ DEVELOPMENT ONLY: Remove in production
router.post('/dev/reset-admin-password', devResetAdminPassword)

export default router
