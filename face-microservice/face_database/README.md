# Face Database - Embeddings Storage

This folder contains scripts for extracting and managing face embeddings from your MySQL database.

## 📁 Structure

```
face_database/
├── extract_embeddings.py      # Script to extract embeddings from database
├── embedding_manager.py       # Utility module for loading/comparing embeddings
├── embeddings/                # Output folder for .npy files (auto-created)
│   ├── user_1_John_Doe.npy
│   ├── user_2_Jane_Smith.npy
│   └── embeddings_index.csv
└── README.md                  # This file
```

## 🚀 Quick Start

### Step 1: Extract Embeddings
```bash
cd face_database
python extract_embeddings.py
```

This will:
- Connect to your MySQL database
- Extract all stored face embeddings
- Save them as `.npy` files in `embeddings/` folder
- Create an `embeddings_index.csv` metadata file

### Step 2: Use in test_camera.py
```bash
cd ..
python test_camera.py --test
```

Or with options:
```bash
python test_camera.py --list      # List all users
python test_camera.py --validate  # Validate embeddings
python test_camera.py --test      # Run matching test
```

## 📜 Files Reference

### extract_embeddings.py
Main extraction script that queries the database and converts embeddings.

**Usage:**
```bash
python extract_embeddings.py
```

**Environment Variables:**
- `DB_HOST` - MySQL host (default: localhost)
- `DB_USER` - MySQL user (default: root)
- `DB_PASSWORD` - MySQL password (default: password)
- `DB_NAME` - Database name (default: enterprise_access_control)
- `DB_PORT` - MySQL port (default: 3306)

### embedding_manager.py
Utility module with the `EmbeddingManager` class for loading and comparing embeddings.

**Key Methods:**
```python
manager = EmbeddingManager('./embeddings')
manager.load_all_embeddings()          # Load all embeddings
manager.find_best_match(embedding)     # Find matching user
manager.list_users()                   # Display all users
```

## 🧪 Integration with test_camera.py

The `test_camera.py` script in the parent folder uses the embedding manager:

```python
from face_database.embedding_manager import EmbeddingManager

manager = EmbeddingManager('face_database/embeddings')
result = test.test_face_recognition(camera_embedding)
```

## ⚙️ Configuration

### Database Connection
Edit database credentials in `extract_embeddings.py`:
```python
DB_CONFIG = {
    'host': 'your-host',
    'user': 'your-user',
    'password': 'your-password',
    'database': 'your-database'
}
```

### Similarity Threshold
Adjust in `embedding_manager.py`:
```python
threshold = 0.6  # Range: 0.0 (all match) to 1.0 (exact match only)
```

## 📊 Output Format

Each embedding is saved as a NumPy `.npy` file:
- **Format**: Binary NumPy array
- **Dtype**: float32
- **Shape**: (512,) or (128,) depending on model
- **Size**: ~2KB per embedding

The `embeddings_index.csv` contains metadata:
```csv
user_id,name,filename,shape,dtype,uploaded_at
1,John Anderson,user_1_John_Anderson.npy,"(512,)",float32,2024-05-20 10:30:00
2,Sarah Mitchell,user_2_Sarah_Mitchell.npy,"(512,)",float32,2024-05-20 11:15:00
```

## 🔧 Troubleshooting

### "No embeddings found in database"
- Make sure face enrollments were saved in the admin dashboard
- Check database connection settings

### "Module not found" errors
Ensure you're in the correct directory:
```bash
cd face-microservice
python test_camera.py  # Correct
python face_database/extract_embeddings.py  # Also correct
```

### Database Connection Failed
Check credentials in `extract_embeddings.py` match your MySQL setup:
```bash
# Test MySQL connection
mysql -h localhost -u root -p -e "USE enterprise_access_control; SELECT COUNT(*) FROM face_embeddings;"
```

## 📝 Notes

- Embeddings are loaded into memory for fast comparison
- Suitable for small to medium deployments (<1000 users)
- For large-scale deployments, consider database-level similarity queries
- The extraction process only needs to run after new face enrollments

---
**Created**: May 20, 2026
**Part of**: Enterprise Access Control System - Face Microservice
