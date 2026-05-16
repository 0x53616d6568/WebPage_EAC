# 🚀 SecureApp Startup Guide

## Quick Start - Development Environment

All services are configured and ready to run. Follow these steps to start the application:

---

## Prerequisites ✅
- ✅ Node.js v16+
- ✅ Python 3.8+  
- ✅ MySQL/Aiven database
- ✅ Virtual environment created
- ✅ All dependencies installed

---

## Terminal Setup

You'll need **3 separate terminals** running simultaneously. Open three terminal windows in your project root directory.

### Terminal 1: Backend API Server (Port 3000)

```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on port 3000 [development]
Database: Connected to enterprise-access-control
MQTT: Connection initialized
```

---

### Terminal 2: Face Recognition Service (Port 5000)

```bash
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Navigate to face service
cd face-microservice

# Start the service
python app.py
```

**Expected Output:**
```
* Running on http://0.0.0.0:5000
* WARNING: This is a development server. Do not use it in production.
```

---

### Terminal 3: Frontend Application (Port 5173 or 3001)

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

---

## Health Checks 🏥

Once all services are running, verify connectivity:

### Backend Health
```bash
curl http://localhost:3000/api/health
```

### Face Service Health
```bash
curl http://localhost:5000/health
```

### Frontend
Open browser: `http://localhost:5173` or `http://localhost:3001`

---

## Default Credentials 🔐

**Admin Login:**
- Email: `admin@example.com`
- Password: `admin123`

---

## Connection Details 📡

- **Database**: `enterprise-access-control` on Aiven
- **MQTT Broker**: `mqtts://bb9f7b883ac247ceb390c4c532330999.s1.eu.hivemq.cloud:8883`
- **Gmail**: Configured for notifications
- **Face Service**: Hugging Face Spaces integration

---

## Troubleshooting 🔧

### Backend fails to start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <PID> /F
```

### Database connection error
- Verify `.env` credentials in `backend/.env`
- Check Aiven dashboard for connection status
- Ensure SSL is properly configured

### Face service won't start
```bash
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Check Python version
python --version

# Reinstall dependencies if needed
pip install -r face-microservice/requirements.txt
```

### Frontend won't load
- Clear browser cache (Ctrl+Shift+Delete)
- Check if Vite server is running on port 5173
- Verify `frontend/.env.local` has correct API URL

---

## Key Endpoints 📍

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Doors
- `GET /api/doors` - List all doors
- `POST /api/doors` - Create new door
- `PUT /api/doors/:id` - Update door

### Access Control
- `POST /api/door-access` - Grant access
- `GET /api/door-access/users/:doorId` - Get users with access
- `DELETE /api/door-access/:id` - Revoke access

### Logs
- `GET /api/logs` - Get access logs
- `GET /api/logs/stats` - Get statistics

---

## Additional Commands 🛠️

### Run connectivity test
```bash
cd backend
node test-connectivity.js
```

### Build frontend for production
```bash
cd frontend
npm run build
```

### Database backup (from your local machine)
```bash
mysqldump -u avnadmin -p -h enterprise-access-control-sameh11-9619.e.aivencloud.com -P 25223 enterprise-access-control > backup.sql
```

---

## Stop All Services 🛑

Press `Ctrl+C` in each terminal to gracefully stop the services.

---

## Next Steps 📋

1. ✅ All services running
2. 📱 Open http://localhost:5173 in browser
3. 🔐 Login with admin credentials
4. 👤 Manage users & doors
5. 🚪 Control access permissions
6. 📊 View access logs

---

**Questions?** Check the INTEGRATION_HANDOUT.md for detailed documentation.

Last Updated: May 16, 2026  
Status: Ready for Development
