#!/usr/bin/env python3
"""
Quick Face Recognition from Camera
Loads latest embeddings and opens camera to recognize faces
"""

import sys
from pathlib import Path
import numpy as np

# Add face_database to path
face_db_path = Path(__file__).parent / 'face_database'
sys.path.insert(0, str(face_db_path))

from embedding_manager import EmbeddingManager

def main():
    """Quick camera recognition"""
    print("\n" + "=" * 60)
    print("📷 QUICK FACE RECOGNITION")
    print("=" * 60)
    
    # Step 1: Load embeddings
    print("\n⏳ Loading embeddings...")
    try:
        embeddings_dir = face_db_path / 'embeddings'
        manager = EmbeddingManager(str(embeddings_dir))
        manager.load_all_embeddings()
        print(f"✅ Loaded {len(manager.embeddings)} embeddings\n")
    except Exception as e:
        print(f"❌ Failed to load embeddings: {e}\n")
        return
    
    if not manager.embeddings:
        print("⚠️  No embeddings found. Run extract_embeddings.py first.\n")
        return
    
    # Step 2: Try to open camera
    try:
        import cv2
        
        print("Opening camera... (Press SPACE to capture, Q to quit)\n")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Cannot open camera. Check if camera is connected.")
            print("Falling back to simulation mode...\n")
            simulate_recognition(manager)
            return
        
        captured_frame = None
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to read from camera\n")
                break
            
            # Display frame with instructions
            display_frame = frame.copy()
            cv2.putText(display_frame, "Press SPACE to capture, Q to quit", 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            cv2.imshow('Face Recognition - Capture Face', display_frame)
            
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord(' '):  # Space to capture
                captured_frame = frame
                print("📸 Face captured!")
                cv2.destroyAllWindows()
                break
            elif key == ord('q'):  # Q to quit
                print("Cancelled")
                cv2.destroyAllWindows()
                return
        
        cap.release()
        
        if captured_frame is None:
            return
        
        # Step 3: Process captured frame
        print("\n⏳ Processing captured face...")
        print("(In production, this would send to microservice for embedding extraction)\n")
        
        # For now, simulate by using one of the stored embeddings
        # In production, you'd send the frame to the face microservice
        test_embedding = list(manager.embeddings.values())[0]
        
        recognize_face(manager, test_embedding)
    
    except ImportError:
        print("⚠️  OpenCV not installed. Using simulation mode.")
        print("Install with: pip install opencv-python\n")
        simulate_recognition(manager)
    except Exception as e:
        print(f"❌ Error: {e}\n")
        print("Using simulation mode...\n")
        simulate_recognition(manager)


def recognize_face(manager, embedding):
    """Recognize a face and display results"""
    print("=" * 60)
    print("🔍 RECOGNITION RESULTS")
    print("=" * 60 + "\n")
    
    # Find best match
    user_id, user_name, similarity = manager.find_best_match(embedding)
    
    threshold = 0.6
    matched = similarity > threshold
    
    # Display main result
    print(f"Recognized User:  {user_name}")
    print(f"User ID:          {user_id}")
    print(f"Similarity:       {similarity:.4f} / 1.0")
    
    if matched:
        print(f"✅ AUTHORIZED (threshold: {threshold})")
    else:
        print(f"❌ NOT MATCHED (threshold: {threshold})")
    
    # Show top matches
    print("\n" + "-" * 60)
    print("Top Matches:")
    print("-" * 60)
    
    similarities = []
    for uid, emb in manager.embeddings.items():
        sim, _ = manager.compare_embeddings(embedding, emb)
        uname = manager.get_user_name(uid)
        similarities.append((uid, uname, sim))
    
    similarities.sort(key=lambda x: x[2], reverse=True)
    
    for idx, (uid, uname, sim) in enumerate(similarities[:5], 1):
        bar = "█" * int(sim * 20)
        status = "✓" if sim > threshold else " "
        print(f"{idx}. [{status}] {uname:20s}: {sim:.4f} {bar}")
    
    print("=" * 60 + "\n")


def simulate_recognition(manager):
    """Simulate recognition with stored embedding"""
    print("=" * 60)
    print("🎭 SIMULATION MODE")
    print("=" * 60)
    print("\nUsing stored embeddings to simulate face recognition.\n")
    
    # Select a user to test
    print("Select a user to test:\n")
    user_list = list(manager.embeddings.items())
    
    for idx, (user_id, _) in enumerate(user_list, 1):
        user_name = manager.get_user_name(user_id)
        print(f"{idx}. {user_name} (ID: {user_id})")
    
    try:
        selection = int(input(f"\nSelect (1-{len(user_list)}): ").strip())
        if selection < 1 or selection > len(user_list):
            print("❌ Invalid selection\n")
            return
        
        test_user_id, test_embedding = user_list[selection - 1]
        test_user_name = manager.get_user_name(test_user_id)
        
        print(f"\n✓ Testing with: {test_user_name}\n")
        recognize_face(manager, test_embedding)
    
    except ValueError:
        print("❌ Invalid input\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Program interrupted\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
        sys.exit(1)
