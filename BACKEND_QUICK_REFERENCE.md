# Backend Functionalities - Quick Reference Handout

> **Brief guide to all backend controllers, endpoints, and utilities**

---

## Controllers & Endpoints

### 1. AUTH (Authentication & Sessions)

**Variables:** `user_id`, `email`, `password_hash`, `role_id`, `access_level`, `accessToken`, `refreshToken`, `deviceId`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/login` | POST | ❌ | Login with email/password |
| `/api/auth/refresh` | POST | ❌ | Refresh access token |
| `/api/auth/logout` | POST | ✅ | Logout & clear session |
| `/api/auth/me` | GET | ✅ | Get current user profile |
| `/api/auth/change-password` | POST | ✅ | Change password |
| `/api/auth/ble-token` | GET | ✅ | Get BLE token for device |
| `/api/auth/ble-tokens` | GET | ✅ | List all BLE tokens |
| `/api/auth/ble-token/rotate` | POST | ✅ | Rotate BLE token |
| `/api/auth/ble-token/revoke` | POST | ✅ | Revoke specific token |
| `/api/auth/ble-tokens/revoke-all` | POST | ✅ | Revoke all tokens |
| `/api/auth/password-reset-request` | POST | ❌ | Request password reset |
| `/api/auth/password-reset-verify` | POST | ❌ | Verify reset token |
| `/api/auth/password-reset` | POST | ❌ | Reset password with token |

**Key Functions:**
- `login()` - Authenticate user, create session
- `refresh()` - Issue new access token
- `getMe()` - Return current user info
- `getBleToken()` - Generate BLE device token

---

### 2. USER (User Management)

**Variables:** `user_id`, `full_name`, `email`, `phone`, `department`, `avatar_url`, `status`, `role_id`, `access_level`, `password_hash`

| Endpoint | Method | Auth | Requires |
|----------|--------|------|----------|
| `/api/users` | GET | ✅ | Manager/Admin to list |
| `/api/users/:id` | GET | ✅ | Own profile or admin |
| `/api/users` | POST | ✅ Admin=5 | Create user (admin only) |
| `/api/users/:id` | PUT | ✅ | Update own profile |
| `/api/users/:id` | DELETE | ✅ Admin=5 | Delete user (admin only) |
| `/api/users/push-token` | POST | ✅ | Update push notification token |

**Key Functions:**
- `getAllUsers()` - List users (managers see team only, admins see all)
- `createUser()` - Create user + send welcome email
- `updateUser()` - Update user profile
- `deleteUser()` - Soft delete user

---

### 3. DOOR (Door & Access Management)

**Variables:** `door_id`, `door_name`, `location`, `security_level`, `user_id`, `allowed_from`, `allowed_until`, `days_of_week`

| Endpoint | Method | Auth | Requires |
|----------|--------|------|----------|
| `/api/doors` | GET | ✅ | List all doors |
| `/api/doors/:id` | GET | ✅ | Get door details |
| `/api/doors` | POST | ✅ Admin=5 | Create door |
| `/api/doors/:id` | PUT | ✅ Admin=5 | Update door |
| `/api/doors/:id` | DELETE | ✅ Admin=5 | Delete door |
| `/api/doors/access/my-doors` | GET | ✅ | Get user's accessible doors |
| `/api/doors/:id/users` | GET | ✅ Admin=5 | Get users for door |
| `/api/doors/:id/assign-user` | POST | ✅ Admin=5 | Assign user to door |
| `/api/doors/:id/remove-user` | DELETE | ✅ Admin=5 | Remove user from door |
| `/api/doors/:id/rules` | GET | ✅ Manager=3 | Get door access rules |
| `/api/doors/:id/rules` | POST | ✅ Admin=5 | Set access rules |
| `/api/doors/:id/rules/:ruleId` | DELETE | ✅ Admin=5 | Delete rule |

**Key Functions:**
- `getAllDoors()` - List all doors
- `getUserAccessibleDoors()` - Get doors for specific user
- `assignUserDoor()` - Assign door access to user
- `removeUserDoor()` - Revoke door access
- `getAccessRules()` - Get door security rules

---

### 4. ATTENDANCE (Check-in/Check-out)

**Variables:** `user_id`, `attendance_id`, `check_in`, `check_out`, `door_id`, `door_name`, `department`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/attendance/me` | GET | ✅ | Get own attendance records |
| `/api/attendance/user/:id` | GET | ✅ Mgr=3 | Get user's attendance |
| `/api/attendance` | GET | ✅ Mgr=3 | Get all attendance |
| `/api/attendance/status/current` | GET | ✅ | Check current status |
| `/api/attendance/logs/:id` | GET | ✅ | Get attendance logs |
| `/api/attendance/check-in` | POST | ✅ | Check-in at door |
| `/api/attendance/check-out` | POST | ✅ | Check-out from door |

**Key Functions:**
- `getMyAttendance()` - User's attendance history
- `checkIn()` - Record check-in
- `checkOut()` - Record check-out
- `getAllAttendance()` - Admin view all attendance

---

### 5. FACE RECOGNITION

**Variables:** `user_id`, `face_embedding`, `confidence_threshold`, `image_data`, `enrollment_status`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/face/enroll` | POST | ✅ Mgr=3 | Enroll user's face |
| `/api/face/recognize` | POST | ✅ | Recognize face in image |
| `/api/face/:user_id` | GET | ✅ | Get face embedding |
| `/api/face/status/:user_id` | GET | ✅ | Check enrollment status |
| `/api/face/batch` | POST | ✅ | Get multiple embeddings |
| `/api/face/:user_id` | DELETE | ✅ Mgr=3 | Delete face profile |

**Key Functions:**
- `enrollFace()` - Store face biometric data
- `recognizeFace()` - Match face in image
- `getFaceEmbedding()` - Get stored face embedding

---

### 6. ACCESS LOGS

**Variables:** `user_id`, `door_id`, `result` (GRANTED/DENIED), `method` (face/ble/rfid/pin/manual), `timestamp`, `face_confidence`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/logs` | GET | ✅ Mgr=3 | Get all access logs |
| `/api/logs/me` | GET | ✅ | Get own access logs |
| `/api/logs/door/:id` | GET | ✅ Mgr=3 | Get logs for door |

**Key Functions:**
- `getAllLogs()` - View all access attempts
- `getMyLogs()` - View own access history
- `getLogsByDoor()` - View logs for specific door

---

### 7. REQUESTS (Leave/Access Requests)

**Variables:** `request_id`, `user_id`, `request_type`, `status`, `created_at`, `reviewed_by`, `reviewed_at`, `reason`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/requests/me` | GET | ✅ | Get own requests |
| `/api/requests` | GET | ✅ Mgr=3 | Get all requests |
| `/api/requests` | POST | ✅ | Create new request |
| `/api/requests/:id/review` | PATCH | ✅ Mgr=3 | Approve/reject request |

**Key Functions:**
- `getMyRequests()` - User's pending requests
- `getAllRequests()` - Manager/admin view
- `createRequest()` - Submit request
- `reviewRequest()` - Approve/reject

---

### 8. VISITORS

**Variables:** `visitor_id`, `host_user_id`, `visitor_name`, `valid_from`, `valid_until`, `status`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/visitors/me` | GET | ✅ | Get own visitor invites |
| `/api/visitors` | GET | ✅ Mgr=3 | Get all visitors |
| `/api/visitors` | POST | ✅ | Create visitor invite |
| `/api/visitors/:id/revoke` | PATCH | ✅ | Revoke visitor access |

**Key Functions:**
- `getMyVisitors()` - User's invited visitors
- `getAllVisitors()` - Manager/admin view
- `createVisitor()` - Invite visitor
- `revokeVisitor()` - Cancel invite

---

### 9. NOTIFICATIONS

**Variables:** `notification_id`, `user_id`, `message`, `type`, `is_read`, `created_at`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/notifications` | GET | ✅ | Get notifications |
| `/api/notifications/:id/read` | PATCH | ✅ | Mark as read |
| `/api/notifications/read-all` | PATCH | ✅ | Mark all read |

**Key Functions:**
- `getMyNotifications()` - Get user's notifications
- `markAsRead()` - Mark single notification
- `markAllAsRead()` - Mark all notifications

---

### 10. PREFERENCES (Settings & Preferences)

**Variables:** `user_id`, `theme`, `notifications_enabled`, `language`, `preferences_json`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/preferences` | GET | ✅ | Get user preferences |
| `/api/preferences/theme` | POST | ✅ | Save theme settings |
| `/api/preferences/notifications` | POST | ✅ | Save notification settings |

**Key Functions:**
- `getUserPreferences()` - Get user settings
- `saveThemePreferences()` - Save theme/appearance
- `saveNotificationPreferences()` - Save notification prefs

---

### 11. ADMIN (Token & Team Management)

**Variables:** `user_id`, `manager_id`, `team_member_ids`, `token_id`, `alert_id`, `status`

| Endpoint | Method | Auth | Requires |
|----------|--------|------|----------|
| `/api/admin/ble-tokens/status` | GET | ✅ Admin=5 | Get token status |
| `/api/admin/ble-tokens/generate/:userId` | POST | ✅ Admin=5 | Generate token |
| `/api/admin/ble-tokens/generate-batch` | POST | ✅ Admin=5 | Batch generate |
| `/api/admin/ble-tokens/audit-log` | GET | ✅ Admin=5 | View token logs |
| `/api/admin/ble-tokens/alerts` | GET | ✅ Admin=5 | Get alerts |
| `/api/admin/ble-tokens/alerts/:id/acknowledge` | POST | ✅ Admin=5 | Acknowledge alert |
| `/api/admin/manager-teams/assign` | POST | ✅ Admin=5 | Assign team to manager |
| `/api/admin/manager-teams/:manager_id` | GET | ✅ Admin=5 | Get manager's team |
| `/api/admin/manager-teams/:manager_id/:member_id` | DELETE | ✅ Admin=5 | Remove team member |
| `/api/admin/emails` | GET | ✅ Admin=5 | View email logs |
| `/api/admin/emails/:emailId` | GET | ✅ Admin=5 | View email content |

**Key Functions:**
- `getUsersTokenStatus()` - Check token status
- `generateTokenForUser()` - Create BLE token
- `assignTeamToManager()` - Assign team members
- `getManagerTeam()` - Get manager's team
- `removeTeamMember()` - Remove from team

---

### 12. MQTT (IoT & Door Access)

**Variables:** `user_id`, `tokenId`, `requestId`, `door_id`, `mqtt_token`, `access_history`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/mqtt/token/generate` | POST | ✅ | Generate MQTT token |
| `/api/mqtt/tokens` | GET | ✅ | Get user's tokens |
| `/api/mqtt/token/:tokenId/revoke` | POST | ✅ | Revoke token |
| `/api/mqtt/tokens/revoke-all` | POST | ✅ | Revoke all tokens |
| `/api/mqtt/request-access` | POST | ✅ | Request door access |
| `/api/mqtt/request/:requestId/face-auth` | POST | ✅ | Submit face auth |
| `/api/mqtt/request/:requestId/status` | GET | ✅ | Get request status |
| `/api/mqtt/request/:requestId/history` | GET | ✅ | Get access history |

**Key Functions:**
- `generateMqttToken()` - Create MQTT token
- `requestDoorAccess()` - Request access
- `submitFaceAuth()` - Authenticate with face
- `getAccessHistory()` - View access attempts

---

### 13. PI (Door Controller Integration)

**Variables:** `user_id`, `door_id`, `result`, `device_info`, `access_token`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/pi/verify` | POST | 🔑 PI_KEY | Verify user access |
| `/api/pi/log` | POST | 🔑 PI_KEY | Log access attempt |
| `/api/pi/sync/:doorId` | GET | 🔑 PI_KEY | Sync door data |
| `/api/pi/door-access-request` | POST | 🔑 PI_KEY | Process door request |

**Key Functions:**
- `verifyAccess()` - Check if user has access
- `logAccessAttempt()` - Record access attempt
- `syncDoorData()` - Sync door config

---

### 14. VIRTUAL DOOR (Testing)

**Variables:** `status`, `unlock_code`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/virtual-door/status` | GET | ❌ | Get door status |
| `/api/virtual-door/unlock` | POST | ✅ | Unlock door |

---

## Utilities

### 1. `response.js` - Response Formatter

```javascript
success(res, data, message, statusCode)  // 200 OK response
error(res, message, statusCode)          // Error response
```

**Usage:**
```javascript
return success(res, { user_id: 5 }, 'User created', 201);
return error(res, 'Invalid email', 400);
```

---

### 2. `jwt.js` - JWT Token Management

```javascript
signAccessToken(payload)      // Create access token (15m)
signRefreshToken(payload)     // Create refresh token (7d)
verifyAccessToken(token)      // Verify & decode access token
verifyRefreshToken(token)     // Verify & decode refresh token
```

**Variables:** `user_id`, `role_id`, `access_level`, `iat`, `exp`

---

### 3. `bleTokenService.js` - BLE Device Tokens

```javascript
createBleToken(userId, deviceName)       // Generate BLE token
getUserBleTokens(userId)                 // List user's tokens
rotateBleToken(tokenId, userId)          // Rotate existing token
revokeBleToken(tokenId)                  // Revoke token
revokeAllUserTokens(userId)              // Revoke all tokens
checkTokensForRotation(userId)           // Check rotation schedule
```

**Variables:** `tokenId`, `displayToken`, `userId`, `deviceName`, `created_at`, `rotated_at`, `expires_at`

---

### 4. `gmailService.js` - Email Service

```javascript
sendWelcomeEmail(email, name, tempPassword)        // Welcome email
sendPasswordResetEmail(email)                       // Password reset link
verifyPasswordResetToken(token)                     // Verify reset token
resetPasswordWithToken(token, newPassword)         // Complete reset
```

**Variables:** `email`, `name`, `tempPassword`, `resetToken`, `resetTokenExpires`

---

### 5. `localEmailService.js` - Local Email Storage (Dev Mode)

```javascript
sendEmail(to, subject, html)             // Store email locally
getEmailLog()                            // Get all emails
getEmailPreview(emailId)                 // Get email content
getEmailsByRecipient(email)              // Get emails for recipient
clearEmails()                            // Clear all stored emails
```

---

### 6. `encryption.js` - Data Encryption

```javascript
encrypt(data, key)                       // Encrypt data
decrypt(encryptedData, key)              // Decrypt data
```

**Variables:** `ENCRYPTION_KEY`, `algorithm` (aes-256-cbc), `iv`

---

### 7. `mqttTokenService.js` - MQTT Tokens

```javascript
generateMqttToken(userId)                // Create MQTT token
validateMqttToken(token)                 // Verify token
revokeMqttToken(tokenId)                 // Revoke token
```

---

### 8. `pushNotifications.js` - Push Notifications

```javascript
sendPushNotification(userId, title, body)  // Send push notification
sendBatchNotifications(userIds, notification)  // Send to multiple
```

---

## Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | user_id, email, password_hash, role_id, access_level |
| `roles` | Role definitions | role_id, role_name, access_level |
| `doors` | Door devices | door_id, door_name, location, security_level |
| `user_door_access` | Door assignments | user_id, door_id, allowed_from, allowed_until, days_of_week |
| `attendance` | Check-in/out records | attendance_id, user_id, check_in, check_out, door_id |
| `access_logs` | Access attempts | log_id, user_id, door_id, result, method, timestamp |
| `requests` | User requests | request_id, user_id, type, status, reviewed_at |
| `visitors` | Visitor invites | visitor_id, host_user_id, valid_from, valid_until |
| `manager_team_members` | Team assignments | manager_id, team_member_id, assigned_at |
| `ble_tokens` | Device tokens | token_id, user_id, displayToken, created_at, expires_at |
| `mqtt_tokens` | MQTT tokens | token_id, user_id, mqtt_token, created_at |
| `notifications` | User notifications | notification_id, user_id, message, is_read, created_at |
| `user_sessions` | Active sessions | session_id, user_id, device_id, auth_token, is_active |
| `password_reset_tokens` | Reset tokens | token_id, user_id, token_hash, expires_at |

---

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=enterprise_access_control

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your_encryption_key

# Email (Gmail API)
GMAIL_USER=your_email@gmail.com
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx

# Face Recognition
FACE_SERVICE_URL=https://your-face-model.hf.space
FACE_SERVICE_API_KEY=sk-xxx
FACE_CONFIDENCE_THRESHOLD=0.65

# MQTT
MQTT_BROKER=mqtt://broker:8883
MQTT_USER=username
MQTT_PASSWORD=password

# PI Integration
PI_API_KEY=your_pi_key

# Server
PORT=3000
NODE_ENV=development
```

---

## Access Levels

```
Level 5: ADMIN         - Full system access
Level 3: MANAGER       - Manage assigned team
Level 1-2: EMPLOYEE    - Basic access only
```

---

## Auth Middleware

```javascript
authenticate    // Verify JWT token, attach req.user
authorize(n)    // Check access_level >= n
piAuthenticate  // Verify PI_API_KEY
```

---

**Last Updated:** May 17, 2026  
**Total Controllers:** 14  
**Total Endpoints:** 90+  
**Total Utilities:** 8

