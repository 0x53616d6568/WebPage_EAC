#!/usr/bin/env python3
"""
Test camera face recognition with stored embeddings from the database
Uses embeddings extracted to face_database/embeddings/ folder
"""

import sys
from pathlib import Path
import numpy as np

# Add face_database folder to path for importing embedding_manager
face_db_path = Path(__file__).parent / 'face_database'
sys.path.insert(0, str(face_db_path))

from embedding_manager import EmbeddingManager

class FaceCameraTest:
    """Test face recognition with stored embeddings"""
    
    def __init__(self):
        """Initialize camera test with embedding manager"""
        # Load embeddings from face_database/embeddings folder
        embeddings_dir = face_db_path / 'embeddings'
        self.manager = EmbeddingManager(str(embeddings_dir))
        self.manager.load_all_embeddings()
    
    def test_face_recognition(self, embedding: np.ndarray) -> dict:
        """
        Test if a face embedding matches stored embeddings
        
        Args:
            embedding: numpy array of face embedding from camera/model
            
        Returns:
            dict: {'user_id': int, 'name': str, 'similarity': float, 'matched': bool}
        """
        user_id, user_name, similarity = self.manager.find_best_match(embedding)
        
        threshold = 0.6  # Adjust for stricter/lenient matching
        matched = similarity > threshold
        
        return {
            'user_id': user_id,
            'name': user_name,
            'similarity': similarity,
            'matched': matched
        }
    
    def list_available_users(self):
        """Display all available users in the database"""
        self.manager.list_users()
    
    def validate_embeddings(self):
        """Validate embeddings by testing each against itself"""
        print("\n" + "=" * 60)
        print("Validating Embeddings (Testing Self-Similarity)")
        print("=" * 60)
        
        for user_id, embedding in self.manager.embeddings.items():
            user_name = self.manager.get_user_name(user_id)
            similarity, _ = self.manager.compare_embeddings(embedding, embedding)
            
            status = "✓" if similarity > 0.99 else "⚠"
            print(f"{status} User {user_id} ({user_name}): {similarity:.6f}")
        
        print("=" * 60 + "\n")


def example_test():
    """Example test of face recognition"""
    print("\n" + "=" * 60)
    print("Face Camera Recognition Test")
    print("=" * 60)
    
    # Initialize test
    test = FaceCameraTest()
    
    # List available users
    print("\nAvailable users in database:")
    test.list_available_users()
    
    # Validate embeddings
    test.validate_embeddings()
    
    # Test matching
    if test.manager.embeddings:
        print("Testing face matching...\n")
        
        # Get first embedding to test
        test_embedding = list(test.manager.embeddings.values())[0]
        result = test.test_face_recognition(test_embedding)
        
        print(f"Test Result:")
        print(f"  Matched: {'✓ YES' if result['matched'] else '✗ NO'}")
        print(f"  User: {result['name']} (ID: {result['user_id']})")
        print(f"  Similarity: {result['similarity']:.4f}\n")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Test face recognition with embeddings')
    parser.add_argument('--validate', action='store_true', help='Validate embeddings')
    parser.add_argument('--list', action='store_true', help='List available users')
    parser.add_argument('--test', action='store_true', help='Run test matching')
    
    args = parser.parse_args()
    
    try:
        test = FaceCameraTest()
        
        if args.validate:
            test.validate_embeddings()
        elif args.list:
            test.list_available_users()
        elif args.test:
            example_test()
        else:
            # Default: run full example
            example_test()
    
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
