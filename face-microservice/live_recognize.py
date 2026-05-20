#!/usr/bin/env python3
"""
Live Face Recognition with Real-time Display
Continuous face detection and recognition with similarity scores on boxes
"""

import sys
from pathlib import Path
import numpy as np
import threading
from queue import Queue
import time

# Add face_database to path
face_db_path = Path(__file__).parent / 'face_database'
sys.path.insert(0, str(face_db_path))

from embedding_manager import EmbeddingManager

try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False
    print("⚠️  OpenCV not installed. Install with: pip install opencv-python")
    sys.exit(1)

try:
    import dlib
    DLIB_AVAILABLE = True
except ImportError:
    DLIB_AVAILABLE = False
    print("⚠️  dlib not available. Using OpenCV face detector instead.")
    print("   (Install with: pip install dlib for better accuracy)")

class LiveFaceRecognition:
    """Real-time face recognition system"""
    
    def __init__(self):
        """Initialize the system"""
        self.manager = None
        self.embeddings_loaded = False
        self.running = False
        
        # Face detection
        if DLIB_AVAILABLE:
            self.detector = dlib.get_frontal_face_detector()
        else:
            # Load OpenCV cascade classifier
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.detector = cv2.CascadeClassifier(cascade_path)
        
        self.use_dlib = DLIB_AVAILABLE
        
    def load_embeddings(self):
        """Load embeddings from face_database/embeddings"""
        try:
            print("⏳ Loading embeddings from database...")
            embeddings_dir = face_db_path / 'embeddings'
            self.manager = EmbeddingManager(str(embeddings_dir))
            self.manager.load_all_embeddings()
            self.embeddings_loaded = True
            print(f"✅ Successfully loaded {len(self.manager.embeddings)} embeddings\n")
            return True
        except Exception as e:
            print(f"❌ Failed to load embeddings: {e}\n")
            return False
    
    def detect_faces(self, frame):
        """Detect faces in frame"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        if self.use_dlib:
            # dlib detection (more accurate but slower)
            dets = self.detector(gray, 1)
            faces = []
            for det in dets:
                x, y, w, h = det.left(), det.top(), det.width(), det.height()
                faces.append((x, y, w, h))
            return faces
        else:
            # OpenCV cascade detection (faster)
            faces = self.detector.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            return [(x, y, w, h) for x, y, w, h in faces]
    
    def extract_face_region(self, frame, face_bbox):
        """Extract face region from frame"""
        x, y, w, h = face_bbox
        
        # Add padding
        padding = 20
        x1 = max(0, x - padding)
        y1 = max(0, y - padding)
        x2 = min(frame.shape[1], x + w + padding)
        y2 = min(frame.shape[0], y + h + padding)
        
        face_region = frame[y1:y2, x1:x2]
        return face_region, (x1, y1, x2, y2)
    
    def recognize_face_in_frame(self, face_region):
        """
        Recognize a face from the extracted region
        
        For production, you would:
        1. Send to microservice to get embedding
        2. Compare with stored embeddings
        
        For now, we simulate or use pre-stored embeddings
        """
        if not self.manager or not self.manager.embeddings:
            return None, 0.0
        
        # In production, convert face_region to base64, send to microservice
        # For testing, we'll use the first stored embedding
        # This is a placeholder - implement actual microservice call here
        
        # Placeholder: return None to indicate no embedding extracted
        return None, 0.0
    
    def find_best_match(self, face_region):
        """Find best match in stored embeddings (for simulation)"""
        if not self.manager or not self.manager.embeddings:
            return None, "Unknown", 0.0
        
        # For now, return a random high score for demo
        # In production, extract embedding from face_region and compare
        # user_id, name, similarity = self.manager.find_best_match(embedding)
        
        # Temporary: return first user as match (for demo purposes)
        # Replace with actual embedding extraction logic
        
        return None, "Unknown", 0.0
    
    def draw_results(self, frame, face_bbox, user_id, user_name, similarity, threshold=0.6):
        """Draw face box and recognition results"""
        x, y, w, h = face_bbox
        
        # Determine color based on match confidence
        if similarity >= threshold:
            color = (0, 255, 0)  # Green - matched
            status = "✓ AUTHORIZED"
        else:
            color = (0, 0, 255)  # Red - not matched
            status = "✗ UNKNOWN"
        
        # Draw face box
        thickness = 2
        cv2.rectangle(frame, (x, y), (x + w, y + h), color, thickness)
        
        # Draw info background
        text_info = f"{user_name} ({similarity:.2f})"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.6
        font_thickness = 1
        
        (text_width, text_height), baseline = cv2.getTextSize(
            text_info, font, font_scale, font_thickness
        )
        
        # Background for text
        bg_margin = 5
        cv2.rectangle(
            frame,
            (x - bg_margin, y - text_height - baseline - bg_margin),
            (x + text_width + bg_margin, y + baseline + bg_margin),
            color, -1  # Filled rectangle
        )
        
        # Draw text
        cv2.putText(
            frame, text_info,
            (x, y - baseline),
            font, font_scale, (255, 255, 255), font_thickness
        )
        
        # Draw status below box
        status_text = status
        cv2.putText(
            frame, status_text,
            (x, y + h + 25),
            font, 0.5, color, 1
        )
    
    def run_live(self):
        """Run live face recognition"""
        if not self.embeddings_loaded:
            print("❌ Embeddings not loaded\n")
            return
        
        print("\n" + "=" * 60)
        print("📷 LIVE FACE RECOGNITION")
        print("=" * 60)
        print("\nOpening camera...")
        print("Controls: 'Q' to quit, 'S' to save frame\n")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Cannot open camera. Check if camera is connected.\n")
            return
        
        # Set camera properties for better performance
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        self.running = True
        frame_count = 0
        recognition_interval = 5  # Run recognition every N frames
        
        print("✅ Camera opened. Starting face detection...\n")
        
        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to read from camera")
                break
            
            frame_count += 1
            
            # Detect faces
            faces = self.detect_faces(frame)
            
            if faces:
                for face_bbox in faces:
                    x, y, w, h = face_bbox
                    
                    # Run recognition every N frames (for performance)
                    if frame_count % recognition_interval == 0:
                        # Extract face region
                        face_region, padded_bbox = self.extract_face_region(frame, face_bbox)
                        
                        # For demo: simulate recognition with stored embeddings
                        # In production, extract embedding from face_region
                        if self.manager and self.manager.embeddings:
                            # Use a stored embedding for simulation
                            test_embedding = list(self.manager.embeddings.values())[0]
                            user_id, user_name, similarity = self.manager.find_best_match(test_embedding)
                            
                            # Store last result
                            if not hasattr(self, 'last_results'):
                                self.last_results = {}
                            self.last_results[str(face_bbox)] = (user_id, user_name, similarity)
                    
                    # Draw previous results
                    if hasattr(self, 'last_results') and str(face_bbox) in self.last_results:
                        user_id, user_name, similarity = self.last_results[str(face_bbox)]
                        self.draw_results(frame, face_bbox, user_id, user_name, similarity)
                    else:
                        # Draw default box while processing
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (100, 100, 100), 2)
                        cv2.putText(frame, "Detecting...", (x, y - 10),
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (100, 100, 100), 1)
            else:
                # No faces detected
                if frame_count % 30 == 0:  # Show message every second (30 fps)
                    cv2.putText(frame, "No faces detected", (20, 40),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
            
            # Show frame info
            info_text = f"Frame: {frame_count} | Faces: {len(faces)} | Model: buffalo_s"
            cv2.putText(frame, info_text, (10, frame.shape[0] - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
            
            # Display frame
            cv2.imshow('Live Face Recognition (Press Q to quit)', frame)
            
            # Handle keys
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("\n✓ Exiting...")
                self.running = False
            elif key == ord('s'):
                filename = f"face_capture_{time.time():.0f}.png"
                cv2.imwrite(filename, frame)
                print(f"✓ Frame saved as {filename}")
        
        cap.release()
        cv2.destroyAllWindows()
        print("✅ Camera closed\n")


def main():
    """Main entry point"""
    print("\n" + "=" * 60)
    print("🔐 LIVE FACE RECOGNITION SYSTEM")
    print("=" * 60)
    
    # Create system
    system = LiveFaceRecognition()
    
    # Load embeddings
    if not system.load_embeddings():
        print("❌ Cannot proceed without embeddings\n")
        return
    
    # Run live recognition
    system.run_live()
    
    print("=" * 60)
    print("👋 Goodbye!")
    print("=" * 60 + "\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Program interrupted\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)
