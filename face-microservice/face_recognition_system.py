#!/usr/bin/env python3
"""
Interactive Face Recognition System
Menu-driven interface for face recognition testing
- Load latest embeddings
- Recognize faces from camera
- Test against stored embeddings
"""

import sys
import os
from pathlib import Path
import numpy as np

# Add face_database to path
face_db_path = Path(__file__).parent / 'face_database'
sys.path.insert(0, str(face_db_path))

from embedding_manager import EmbeddingManager

class FaceRecognitionSystem:
    """Interactive face recognition system"""
    
    def __init__(self):
        """Initialize the system"""
        self.manager = None
        self.embeddings_loaded = False
        self.selected_user = None
        
    def load_embeddings(self):
        """Load embeddings from face_database/embeddings"""
        try:
            print("\n⏳ Loading embeddings from database...")
            embeddings_dir = face_db_path / 'embeddings'
            self.manager = EmbeddingManager(str(embeddings_dir))
            self.manager.load_all_embeddings()
            self.embeddings_loaded = True
            print(f"✅ Successfully loaded {len(self.manager.embeddings)} embeddings\n")
            return True
        except Exception as e:
            print(f"❌ Failed to load embeddings: {e}\n")
            return False
    
    def show_main_menu(self):
        """Display main menu"""
        print("\n" + "=" * 60)
        print("🔐 FACE RECOGNITION SYSTEM")
        print("=" * 60)
        
        if not self.embeddings_loaded:
            print("\n⚠️  No embeddings loaded. Please load embeddings first.\n")
            print("1. Load Embeddings from Database")
            print("0. Exit")
        else:
            print("\n✅ Embeddings Loaded")
            print(f"   Total users: {len(self.manager.embeddings)}\n")
            
            print("1. 📷 Open Camera & Recognize Face")
            print("2. 📋 List Available Users")
            print("3. ✔️  Validate Embeddings")
            print("4. 🔄 Reload Embeddings")
            print("0. Exit")
        
        print("\n" + "-" * 60)
    
    def list_users(self):
        """Display list of available users"""
        if not self.embeddings_loaded:
            print("❌ No embeddings loaded\n")
            return
        
        print("\n" + "=" * 60)
        print("📋 AVAILABLE USERS")
        print("=" * 60)
        self.manager.list_users()
        input("\nPress Enter to continue...")
    
    def validate_embeddings(self):
        """Validate embeddings by testing self-similarity"""
        if not self.embeddings_loaded:
            print("❌ No embeddings loaded\n")
            return
        
        print("\n" + "=" * 60)
        print("✔️  VALIDATING EMBEDDINGS")
        print("=" * 60)
        print("\nTesting each embedding against itself (should be ~1.0):\n")
        
        all_valid = True
        for user_id, embedding in self.manager.embeddings.items():
            user_name = self.manager.get_user_name(user_id)
            similarity, _ = self.manager.compare_embeddings(embedding, embedding)
            
            status = "✓" if similarity > 0.99 else "⚠"
            if similarity < 0.99:
                all_valid = False
            
            print(f"{status} User {user_id:3d} ({user_name:20s}): {similarity:.6f}")
        
        print("\n" + "-" * 60)
        if all_valid:
            print("✅ All embeddings validated successfully!")
        else:
            print("⚠️  Some embeddings may have issues")
        print("-" * 60 + "\n")
        
        input("Press Enter to continue...")
    
    def open_camera_recognize(self):
        """Open camera and try to recognize face"""
        if not self.embeddings_loaded:
            print("❌ No embeddings loaded\n")
            return
        
        print("\n" + "=" * 60)
        print("📷 FACE RECOGNITION MODE")
        print("=" * 60)
        
        print("\nOptions:")
        print("1. Simulate with stored embedding (for testing)")
        print("2. Capture from camera (requires camera)")
        print("0. Back to menu")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == '1':
            self.simulate_recognition()
        elif choice == '2':
            self.capture_from_camera()
        elif choice == '0':
            return
        else:
            print("❌ Invalid option\n")
    
    def simulate_recognition(self):
        """Simulate recognition using stored embeddings"""
        print("\n" + "-" * 60)
        print("SIMULATED FACE RECOGNITION TEST")
        print("-" * 60 + "\n")
        
        if not self.manager.embeddings:
            print("❌ No embeddings available\n")
            return
        
        # Select a user to test
        print("Select a user to test (simulate their face):\n")
        user_list = list(self.manager.embeddings.items())
        
        for idx, (user_id, _) in enumerate(user_list, 1):
            user_name = self.manager.get_user_name(user_id)
            print(f"{idx}. User {user_id} - {user_name}")
        
        try:
            selection = int(input(f"\nSelect (1-{len(user_list)}): ").strip())
            if selection < 1 or selection > len(user_list):
                print("❌ Invalid selection\n")
                return
            
            test_user_id, test_embedding = user_list[selection - 1]
            test_user_name = self.manager.get_user_name(test_user_id)
            
            print(f"\n✓ Testing with: {test_user_name} (ID: {test_user_id})")
            print("\nRunning face recognition...\n")
            
            # Recognize
            found_user_id, found_name, similarity = self.manager.find_best_match(test_embedding)
            
            # Display results
            print("=" * 60)
            print("RECOGNITION RESULT")
            print("=" * 60)
            print(f"Test User:       {test_user_name} (ID: {test_user_id})")
            print(f"Recognized As:   {found_name} (ID: {found_user_id})")
            print(f"Similarity:      {similarity:.4f} (0.0 - 1.0)")
            
            threshold = 0.6
            match_status = "✅ MATCH" if similarity > threshold else "❌ NO MATCH"
            print(f"Status:          {match_status} (threshold: {threshold})")
            
            # Show all similarities
            print("\n" + "-" * 60)
            print("Similarity with all users:")
            print("-" * 60)
            
            similarities = []
            for user_id, embedding in self.manager.embeddings.items():
                user_name = self.manager.get_user_name(user_id)
                sim, _ = self.manager.compare_embeddings(test_embedding, embedding)
                similarities.append((user_id, user_name, sim))
            
            # Sort by similarity (descending)
            similarities.sort(key=lambda x: x[2], reverse=True)
            
            for user_id, user_name, sim in similarities[:5]:  # Top 5
                bar = "█" * int(sim * 20)
                print(f"{user_name:20s}: {sim:.4f} {bar}")
            
            print("=" * 60 + "\n")
        
        except ValueError:
            print("❌ Invalid input\n")
        
        input("Press Enter to continue...")
    
    def capture_from_camera(self):
        """Capture face from camera and recognize"""
        print("\n" + "-" * 60)
        print("CAMERA FACE RECOGNITION")
        print("-" * 60 + "\n")
        
        try:
            import cv2
            import base64
            from io import BytesIO
            
            print("Opening camera... (Press 'q' to quit)\n")
            
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                print("❌ Cannot open camera. Check if camera is connected.\n")
                return
            
            print("Camera opened. Press SPACE to capture face, Q to quit.\n")
            
            captured = False
            frame_capture = None
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("❌ Failed to read from camera\n")
                    break
                
                # Display frame
                cv2.imshow('Face Recognition - Press SPACE to capture', frame)
                
                key = cv2.waitKey(1) & 0xFF
                
                if key == ord(' '):  # Space to capture
                    frame_capture = frame
                    captured = True
                    print("📸 Face captured!")
                    cv2.destroyAllWindows()
                    break
                elif key == ord('q'):  # Q to quit
                    print("Cancelled")
                    cv2.destroyAllWindows()
                    input("Press Enter to continue...")
                    return
            
            cap.release()
            
            if not captured or frame_capture is None:
                return
            
            # Here you would normally send to microservice to get embedding
            # For now, we'll simulate with a stored embedding
            print("\n⚠️  Camera capture complete, but embedding extraction requires")
            print("   connection to face microservice.")
            print("\nFor full face recognition, you would need to:")
            print("1. Send captured image to microservice")
            print("2. Get embedding vector")
            print("3. Compare with stored embeddings")
            print("\nFalling back to simulation...\n")
            
            self.simulate_recognition()
        
        except ImportError:
            print("❌ OpenCV not installed. Install with: pip install opencv-python\n")
            print("Falling back to simulation mode...\n")
            self.simulate_recognition()
        except Exception as e:
            print(f"❌ Error: {e}\n")
            input("Press Enter to continue...")
    
    def run(self):
        """Main program loop"""
        print("\n" + "=" * 60)
        print("🔐 FACE RECOGNITION SYSTEM - Starting")
        print("=" * 60)
        
        while True:
            self.show_main_menu()
            choice = input("Select option: ").strip()
            
            if not self.embeddings_loaded:
                if choice == '1':
                    self.load_embeddings()
                elif choice == '0':
                    self.exit_program()
                else:
                    print("❌ Invalid option. Load embeddings first.\n")
            else:
                if choice == '1':
                    self.open_camera_recognize()
                elif choice == '2':
                    self.list_users()
                elif choice == '3':
                    self.validate_embeddings()
                elif choice == '4':
                    self.load_embeddings()
                elif choice == '0':
                    self.exit_program()
                else:
                    print("❌ Invalid option\n")
    
    def exit_program(self):
        """Exit the program"""
        print("\n" + "=" * 60)
        print("👋 Goodbye!")
        print("=" * 60 + "\n")
        sys.exit(0)


def main():
    """Entry point"""
    try:
        system = FaceRecognitionSystem()
        system.run()
    except KeyboardInterrupt:
        print("\n\n❌ Program interrupted by user\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}\n")
        sys.exit(1)


if __name__ == '__main__':
    main()
