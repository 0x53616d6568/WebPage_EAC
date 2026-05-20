# Face Recognition Scripts Guide

This folder contains interactive scripts for face recognition testing and development.

## 📁 Available Scripts

### 1. **live_recognize_pro.py** ⭐⭐⭐ (BEST - Real-time with Boxes)
Advanced real-time face recognition with continuous detection and similarity boxes.

**What it does:**
- ✅ Live video stream with continuous processing
- ✅ Detects multiple faces simultaneously
- ✅ Draws boxes around faces with similarity scores
- ✅ Shows live similarity scores
- ✅ Integrates with face microservice
- ✅ Non-blocking microservice calls for smooth video

**Run:**
```bash
python live_recognize_pro.py
```

**Controls:**
- **Q** - Quit
- **S** - Save frame
- **M** - Toggle between microservice and local storage mode

**What You'll See:**
```
┌─────────────────────────┐
│ Sameh (0.95)            │
│ ✓ MATCH                 │  Green box = Matched
│                         │
│      [Face Here]        │  Similarity score live
│                         │
└─────────────────────────┘
```

---

### 2. **live_recognize.py**
Real-time face recognition with basic OpenCV face detection.

**Run:**
```bash
python live_recognize.py
```

---

### 3. **quick_recognize.py** 
Single frame capture and recognition.

**Run:**
```bash
python quick_recognize.py
```

---

### 4. **face_recognition_system.py** 
Advanced menu-driven face recognition system.

**What it does:**
- Load embeddings from database
- Open camera and recognize
- List all users
- Validate embeddings
- Simulate recognition with stored embeddings

**Run:**
```bash
python face_recognition_system.py
```

**Menu Options:**
1. **📷 Open Camera & Recognize** - Use real camera to capture and recognize
2. **📋 List Available Users** - View all enrolled users
3. **✔️ Validate Embeddings** - Test embedding quality
4. **🔄 Reload Embeddings** - Reload from database
5. **0 Exit** - Close program

---

### 3. **test_camera.py**
Basic test script for embeddings (created earlier).

**Run:**
```bash
python test_camera.py --help
```

**Options:**
```bash
python test_camera.py --list       # List users
python test_camera.py --validate   # Validate embeddings
python test_camera.py --test       # Run test matching
```

---

### 4. **face_database/extract_embeddings.py**
Extract embeddings from database into .npy files.

**Run:**
```bash
cd face_database
python extract_embeddings.py
```

This creates:
- `embeddings/*.npy` - Face embedding files
- `embeddings/embeddings_index.csv` - Metadata index

---

## 🚀 Quick Start (5 minutes)

### Step 1: Extract Latest Embeddings
```bash
cd face_database
python extract_embeddings.py
cd ..
```

### Step 2: Open Camera & Recognize
```bash
python quick_recognize.py
```

**That's it!** The system will:
1. Load your stored embeddings
2. Open webcam
3. You capture a face by pressing SPACE
4. It shows who matches best

---

## 📋 Requirements

**Python Packages:**
```bash
pip install mysql-connector-python numpy python-dotenv opencv-python requests
```

**Optional (for better face detection accuracy):**
```bash
pip install dlib
```

**Database:**
- Embeddings must be extracted first using `extract_embeddings.py`
- Stored in `face_database/embeddings/` folder

**Microservice:**
- Face embedding extraction service (Hugging Face Space with buffalo_s model)

---

## 🎯 Workflow Examples

### Example 1: Test Specific User
```bash
python face_recognition_system.py
# 1. Load Embeddings
# 1. Open Camera & Recognize
# 1. Simulate with stored embedding
# Select user "John" to test
```

### Example 2: Validate All Embeddings
```bash
python face_recognition_system.py
# 1. Load Embeddings
# 3. Validate Embeddings
```

### Example 3: Quick Test with Your Camera
```bash
python quick_recognize.py
# Press SPACE to capture
# See recognition results
```

---

## 🔍 Understanding Results

### Similarity Score
- **0.0-0.3**: No match
- **0.3-0.6**: Weak match (not authorized)
- **0.6-0.8**: Strong match ✅
- **0.8-1.0**: Very strong match ✅

### Status
```
✅ AUTHORIZED  - Similarity > 0.6 (default threshold)
❌ NOT MATCHED - Similarity < 0.6
```

---

## 🔧 Configuration

### Change Similarity Threshold

Edit `face_database/embedding_manager.py`:

```python
def compare_embeddings(self, e1, e2):
    # ...
    threshold = 0.6  # Change this value
    # Higher = stricter, Lower = more lenient
```

### Change Face Service URL

Update `.env` file:
```
FACE_SERVICE_URL=https://your-microservice-url
```

---

## 🐛 Troubleshooting

### "No embeddings found"
```bash
# Make sure you extracted embeddings first
cd face_database
python extract_embeddings.py
```

### "Cannot open camera"
```bash
# Install OpenCV or use simulation mode
pip install opencv-python
```

### "Database connection failed"
```bash
# Check .env file has correct credentials
# Ensure database is running
```

### "Microservice connection refused"
Check that face microservice is running and URL is correct in `.env`

---

## 📊 File Structure

```
face-microservice/
├── quick_recognize.py              ⭐ Start here
├── face_recognition_system.py      Interactive menu system
├── test_camera.py                  Basic test script
├── face_database/
│   ├── extract_embeddings.py       Extract from database
│   ├── embedding_manager.py        Utility for loading/comparing
│   ├── embeddings/                 Generated .npy files
│   │   ├── user_73_sameh.npy
│   │   └── embeddings_index.csv
│   └── README.md
├── app.py                          Flask microservice (if local)
├── models.py
├── requirements.txt
└── config.py
```

---

## 🔄 Production Workflow

1. **Enroll Faces** - Users enroll via admin dashboard
2. **Extract Embeddings** - Daily: `python extract_embeddings.py`
3. **Recognize** - Deploy `quick_recognize.py` to Raspberry Pi or access point
4. **Monitor** - Check logs and similarity scores

---

## 📝 Notes

- Embeddings are loaded into memory (supports ~1000 users)
- Similarity is computed using cosine distance
- Recognition is real-time (~50ms per comparison)
- Works with buffalo_s model (fine-tuned embeddings)

---

**Created:** May 20, 2026  
**Part of:** Enterprise Access Control System
