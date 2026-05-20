"""
Utility module for loading and comparing face embeddings
For use with test_camera.py
"""

import numpy as np
from pathlib import Path
import csv
from typing import Optional, Dict, Tuple

class EmbeddingManager:
    """Manage loaded embeddings for testing"""
    
    def __init__(self, embeddings_dir: str = './embeddings'):
        self.embeddings_dir = Path(embeddings_dir)
        self.embeddings = {}
        self.metadata = {}
        self.load_index()
    
    def load_index(self):
        """Load embeddings metadata from index file"""
        index_file = self.embeddings_dir / 'embeddings_index.csv'
        
        if not index_file.exists():
            print(f"⚠ Index file not found: {index_file}")
            return
        
        try:
            with open(index_file, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    user_id = int(row['user_id'])
                    self.metadata[user_id] = {
                        'name': row['name'],
                        'filename': row['filename'],
                        'shape': row['shape'],
                        'dtype': row['dtype'],
                        'uploaded_at': row['uploaded_at']
                    }
            
            print(f"✓ Loaded metadata for {len(self.metadata)} users")
        except Exception as e:
            print(f"✗ Error loading index: {e}")
    
    def load_embedding(self, user_id: int) -> Optional[np.ndarray]:
        """Load a specific embedding by user_id"""
        if user_id not in self.metadata:
            print(f"✗ No metadata for user {user_id}")
            return None
        
        filename = self.metadata[user_id]['filename']
        filepath = self.embeddings_dir / filename
        
        if not filepath.exists():
            print(f"✗ Embedding file not found: {filepath}")
            return None
        
        try:
            embedding = np.load(filepath)
            self.embeddings[user_id] = embedding
            return embedding
        except Exception as e:
            print(f"✗ Error loading embedding: {e}")
            return None
    
    def load_all_embeddings(self) -> Dict[int, np.ndarray]:
        """Load all available embeddings"""
        for user_id in self.metadata.keys():
            self.load_embedding(user_id)
        
        print(f"✓ Loaded {len(self.embeddings)} embeddings")
        return self.embeddings
    
    def compare_embeddings(self, embedding1: np.ndarray, embedding2: np.ndarray) -> Tuple[float, bool]:
        """
        Compare two embeddings using cosine similarity
        Returns: (similarity_score, is_match) where is_match is True if similarity > threshold
        """
        try:
            # Normalize embeddings
            norm1 = embedding1 / (np.linalg.norm(embedding1) + 1e-8)
            norm2 = embedding2 / (np.linalg.norm(embedding2) + 1e-8)
            
            # Cosine similarity
            similarity = np.dot(norm1, norm2)
            
            # Threshold for match (adjust as needed)
            threshold = 0.6
            is_match = similarity > threshold
            
            return similarity, is_match
        except Exception as e:
            print(f"✗ Error comparing embeddings: {e}")
            return 0.0, False
    
    def find_best_match(self, input_embedding: np.ndarray) -> Tuple[Optional[int], str, float]:
        """
        Find the best matching user for an input embedding
        Returns: (user_id, user_name, similarity_score)
        """
        if not self.embeddings:
            self.load_all_embeddings()
        
        best_match_id = None
        best_match_name = "Unknown"
        best_similarity = 0.0
        
        for user_id, stored_embedding in self.embeddings.items():
            similarity, _ = self.compare_embeddings(input_embedding, stored_embedding)
            
            if similarity > best_similarity:
                best_similarity = similarity
                best_match_id = user_id
                best_match_name = self.metadata[user_id]['name']
        
        return best_match_id, best_match_name, best_similarity
    
    def get_user_name(self, user_id: int) -> Optional[str]:
        """Get user name by ID"""
        if user_id in self.metadata:
            return self.metadata[user_id]['name']
        return None
    
    def list_users(self):
        """List all available users"""
        print("\n📋 Available Users:")
        print("-" * 50)
        for user_id, metadata in sorted(self.metadata.items()):
            print(f"ID: {user_id:3d} | Name: {metadata['name']:20s} | Uploaded: {metadata['uploaded_at']}")
        print("-" * 50)


def example_usage():
    """Example of how to use EmbeddingManager"""
    print("=" * 60)
    print("Embedding Manager Example")
    print("=" * 60)
    
    # Initialize manager
    manager = EmbeddingManager('./embeddings')
    
    # List available users
    manager.list_users()
    
    # Load a specific user's embedding
    if manager.metadata:
        user_id = list(manager.metadata.keys())[0]
        embedding = manager.load_embedding(user_id)
        
        if embedding is not None:
            print(f"\n✓ Loaded embedding for user {user_id}")
            print(f"  Shape: {embedding.shape}")
            print(f"  Dtype: {embedding.dtype}")
            print(f"  Min/Max: {embedding.min():.4f} / {embedding.max():.4f}")


if __name__ == '__main__':
    example_usage()
