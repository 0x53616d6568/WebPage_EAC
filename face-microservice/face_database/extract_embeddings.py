"""
Extract face embeddings from database and save as .npy files
Supports local and Aiven cloud databases
Embeddings are stored as BLOBs (raw bytes) from base64-encoded vectors
Backend format: Buffer.from(embedding_base64, 'base64')
"""

import os
import sys
import mysql.connector
import numpy as np
from pathlib import Path

# Load .env file if it exists
env_file = Path(__file__).parent.parent.parent / '.env'
if env_file.exists():
    try:
        from dotenv import load_dotenv
        load_dotenv(env_file)
    except ImportError:
        print("⚠ python-dotenv not installed. Using environment variables or defaults.")

# Database configuration (matches backend/config/database.js)
DB_CONFIG = {
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'root123'),
    'database': os.getenv('DB_NAME', 'enterprise_access_control'),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Add SSL for Aiven if enabled
if os.getenv('DB_ENABLE_SSL', 'false').lower() == 'true':
    DB_CONFIG['ssl_disabled'] = False
    DB_CONFIG['ssl_verify_cert'] = False
    DB_CONFIG['ssl_verify_identity'] = False

# Output directory - saves embeddings in face_database folder
OUTPUT_DIR = Path(__file__).parent / 'embeddings'
OUTPUT_DIR.mkdir(exist_ok=True)

def get_db_connection():
    """Create database connection"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        print("✓ Connected to database")
        return conn
    except mysql.connector.Error as e:
        print(f"✗ Database connection failed: {e}")
        sys.exit(1)

def convert_blob_to_array(blob_data):
    """
    Convert BLOB data to numpy float32 array
    
    Backend stores embeddings as: Buffer.from(embedding_base64, 'base64')
    This means the BLOB contains raw bytes that should be interpreted as float32
    """
    if not blob_data:
        return None
    
    try:
        # Ensure the blob size is a multiple of 4 bytes (size of float32)
        if len(blob_data) % 4 != 0:
            # Trim to nearest multiple of 4
            trimmed_len = (len(blob_data) // 4) * 4
            blob_data = blob_data[:trimmed_len]
        
        # Convert raw bytes to float32 numpy array
        embedding_array = np.frombuffer(blob_data, dtype=np.float32)
        return embedding_array
    except Exception as e:
        print(f"  ⚠ Error converting blob: {e}")
        return None

def extract_embeddings():
    """Extract embeddings from database and save as .npy files"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Query embeddings from database
        # Note: 'embedding' column is stored as BLOB (raw bytes from base64 decode)
        query = """
        SELECT fe.id, fe.user_id, u.full_name, fe.embedding, fe.enrolled_at, fe.model_version
        FROM face_embeddings fe
        JOIN users u ON fe.user_id = u.user_id
        ORDER BY fe.user_id
        """
        
        cursor.execute(query)
        embeddings = cursor.fetchall()
        
        if not embeddings:
            print("⚠ No embeddings found in database")
            return
        
        print(f"\n📊 Found {len(embeddings)} embeddings in database\n")
        
        saved_files = []
        
        for embedding_data in embeddings:
            user_id = embedding_data['user_id']
            full_name = embedding_data['full_name']
            embedding_blob = embedding_data['embedding']
            enrolled_at = embedding_data['enrolled_at']
            model_version = embedding_data.get('model_version', 'buffalo_s')
            
            try:
                # Convert BLOB to numpy array (matching backend format)
                embedding_array = convert_blob_to_array(embedding_blob)
                
                if embedding_array is None:
                    print(f"✗ Failed to convert embedding for user {user_id}\n")
                    continue
                
                # Create filename
                filename = f"user_{user_id}_{full_name.replace(' ', '_')}.npy"
                filepath = OUTPUT_DIR / filename
                
                # Save as .npy file (numpy's native format)
                np.save(filepath, embedding_array)
                
                saved_files.append({
                    'user_id': user_id,
                    'name': full_name,
                    'file': filename,
                    'shape': embedding_array.shape,
                    'dtype': str(embedding_array.dtype),
                    'model_version': model_version,
                    'enrolled_at': enrolled_at
                })
                
                print(f"✓ Saved: {filename}")
                print(f"  ├─ Shape: {embedding_array.shape}")
                print(f"  ├─ Dtype: {embedding_array.dtype}")
                print(f"  └─ Model: {model_version}\n")
                
            except Exception as e:
                print(f"✗ Error processing user {user_id} ({full_name}): {e}\n")
        
        # Create index file with metadata
        if saved_files:
            create_index_file(saved_files)
            print(f"\n✅ Successfully extracted {len(saved_files)} embeddings!")
            print(f"📁 Files saved to: {OUTPUT_DIR.absolute()}\n")
        
    finally:
        cursor.close()
        conn.close()

def create_index_file(embeddings_info):
    """Create a CSV index file with embedding metadata"""
    index_file = OUTPUT_DIR / 'embeddings_index.csv'
    
    try:
        with open(index_file, 'w') as f:
            f.write("user_id,name,filename,shape,dtype,model_version,enrolled_at\n")
            for info in embeddings_info:
                f.write(f"{info['user_id']},{info['name']},{info['file']},\"{info['shape']}\",{info['dtype']},{info['model_version']},{info['enrolled_at']}\n")
        
        print(f"✓ Created index file: embeddings_index.csv")
    except Exception as e:
        print(f"✗ Error creating index file: {e}")

def load_embedding(user_id, name):
    """Load a specific embedding by user_id"""
    filename = f"user_{user_id}_{name.replace(' ', '_')}.npy"
    filepath = OUTPUT_DIR / filename
    
    if filepath.exists():
        embedding = np.load(filepath)
        print(f"✓ Loaded embedding for user {user_id}: shape {embedding.shape}")
        return embedding
    else:
        print(f"✗ Embedding not found: {filename}")
        return None

if __name__ == '__main__':
    print("=" * 60)
    print("Face Embeddings Extractor")
    print("=" * 60)
    
    extract_embeddings()
    
    print("\n" + "=" * 60)
    print("✨ Embeddings are ready for testing with test_camera.py")
    print("=" * 60)
