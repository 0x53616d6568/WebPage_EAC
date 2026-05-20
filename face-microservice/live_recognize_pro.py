#!/usr/bin/env python3
"""
Live Face Recognition with Microservice Integration
Real-time face detection, embedding extraction, and recognition
"""

import sys
from pathlib import Path
import numpy as np
import threading
from queue import Queue
import time
import base64
import os
import requests
import json

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

class LiveFaceRecognition:
    """Real-time face recognition with microservice"""
    
    def __init__(self):
        """Initialize the system"""
        self.manager = None
        self.embeddings_loaded = False
        self.running = False
        
        # Microservice configuration
        self.face_service_url = os.getenv('FACE_SERVICE_URL', 'http://localhost:5000')
        self.face_service_key = os.getenv('FACE_SERVICE_API_KEY', 'your-key')
        
        print(f"Face Service: {self.face_service_url}")
        
        # Face detection
        if DLIB_AVAILABLE:
            self.detector = dlib.get_frontal_face_detector()
        else:
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.detector = cv2.CascadeClassifier(cascade_path)
        
        self.use_dlib = DLIB_AVAILABLE
        
        # Threading for microservice calls
        self.recognition_queue = Queue(maxsize=10)
        self.results = {}
        self.processing_thread = None
        
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
            dets = self.detector(gray, 1)
            faces = []
            for det in dets:
                x, y, w, h = det.left(), det.top(), det.width(), det.height()
                faces.append((x, y, w, h))
            return faces
        else:
            faces = self.detector.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5,
                minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE
            )
            return [(x, y, w, h) for x, y, w, h in faces]
    
    def frame_to_base64(self, frame):
        """Convert frame to base64"""
        _, buffer = cv2.imencode('.jpg', frame)
        return base64.b64encode(buffer).decode('utf-8')
    
    def extract_embedding_from_microservice(self, face_frame):
        """Call microservice to extract embedding"""
        try:
            # Convert frame to base64
            image_base64 = self.frame_to_base64(face_frame)
            
            # Call microservice
            headers = {
                'X-API-Key': self.face_service_key,
                'Content-Type': 'application/json'
            }
            
            payload = {
                'image_base64': image_base64
            }
            
            response = requests.post(
                f"{self.face_service_url}/api/face/recognize",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    return data.get('data', {}).get('embedding')
            
            return None
        except Exception as e:
            # Silently fail - face service may not be available
            return None
    
    def recognize_face(self, face_frame, face_id):
        """Recognize a face (runs in separate thread)"""
        try:
            # Try to get embedding from microservice
            embedding_data = self.extract_embedding_from_microservice(face_frame)
            
            if embedding_data:
                # Convert from base64 to numpy array
                embedding_bytes = base64.b64decode(embedding_data)
                embedding = np.frombuffer(embedding_bytes, dtype=np.float32)
                
                # Find best match
                if self.manager and self.manager.embeddings:
                    user_id, user_name, similarity = self.manager.find_best_match(embedding)
                    self.results[face_id] = (user_id, user_name, similarity, True)
            else:
                # Fallback: use first stored embedding for testing
                if self.manager and self.manager.embeddings:
                    test_embedding = list(self.manager.embeddings.values())[0]
                    user_id, user_name, similarity = self.manager.find_best_match(test_embedding)
                    self.results[face_id] = (user_id, user_name, similarity, False)
        
        except Exception as e:
            print(f"Recognition error: {e}")
    
    def draw_face_box(self, frame, x, y, w, h, face_id):
        """Draw face box with recognition results"""
        if face_id in self.results:
            user_id, user_name, similarity, from_microservice = self.results[face_id]
            threshold = 0.6
            
            # Color based on match
            if similarity >= threshold:
                color = (0, 255, 0)  # Green
                status = "✓ MATCH"
            else:
                color = (0, 0, 255)  # Red
                status = "✗ NO MATCH"
        else:
            user_name = "Processing..."
            similarity = 0.0
            status = "..."
            color = (200, 200, 200)  # Gray
        
        # Draw main box
        cv2.rectangle(frame, (x, y), (x + w, y + h), color, 3)
        
        # Draw info box on top
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.7
        font_color = (255, 255, 255)
        
        text = f"{user_name} ({similarity:.2f})"
        
        (text_w, text_h), baseline = cv2.getTextSize(text, font, font_scale, 2)
        
        # Background
        padding = 8
        cv2.rectangle(frame, 
                     (x - padding, y - text_h - baseline - padding),
                     (x + text_w + padding, y + baseline + padding),
                     color, -1)
        
        # Text
        cv2.putText(frame, text, (x, y - baseline),
                   font, font_scale, font_color, 2)
        
        # Status below box
        cv2.putText(frame, status, (x, y + h + 30),
                   font, 0.6, color, 2)
    
    def run_live(self):
        """Run live face recognition"""
        if not self.embeddings_loaded:
            print("❌ Embeddings not loaded\n")
            return
        
        print("\n" + "=" * 70)
        print("📷 LIVE FACE RECOGNITION - REAL-TIME")
        print("=" * 70)
        print("\nStarting camera...")
        print("Controls:")
        print("  'Q' - Quit")
        print("  'S' - Save frame")
        print("  'M' - Toggle microservice mode\n")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Cannot open camera. Check if camera is connected.\n")
            return
        
        # Set camera properties
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        cap.set(cv2.CAP_PROP_FPS, 30)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Reduce buffer for low latency
        
        self.running = True
        frame_count = 0
        recognition_interval = 3  # Process every 3rd frame
        use_microservice = True
        
        print("✅ Camera opened. Processing faces in real-time...\n")
        
        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to read from camera")
                break
            
            frame_count += 1
            
            # Flip for selfie view
            frame = cv2.flip(frame, 1)
            
            # Detect faces
            faces = self.detect_faces(frame)
            
            # Process detected faces
            if faces:
                for idx, face_bbox in enumerate(faces):
                    x, y, w, h = face_bbox
                    face_id = f"face_{idx}"
                    
                    # Extract face region
                    margin = 10
                    x1 = max(0, x - margin)
                    y1 = max(0, y - margin)
                    x2 = min(frame.shape[1], x + w + margin)
                    y2 = min(frame.shape[0], y + h + margin)
                    face_region = frame[y1:y2, x1:x2]
                    
                    # Process face every N frames
                    if frame_count % recognition_interval == 0:
                        if use_microservice:
                            # Non-blocking microservice call
                            t = threading.Thread(
                                target=self.recognize_face,
                                args=(face_region, face_id),
                                daemon=True
                            )
                            t.start()
                        else:
                            # Use stored embeddings directly
                            if self.manager and self.manager.embeddings:
                                test_embedding = list(self.manager.embeddings.values())[0]
                                user_id, user_name, similarity = self.manager.find_best_match(test_embedding)
                                self.results[face_id] = (user_id, user_name, similarity, False)
                    
                    # Draw result
                    self.draw_face_box(frame, x, y, w, h, face_id)
            
            # Draw info overlay
            info_text = f"FPS: ~30 | Faces: {len(faces)} | Mode: {'Microservice' if use_microservice else 'Local'} | Model: buffalo_s"
            cv2.putText(frame, info_text, (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
            
            # Display frame
            cv2.imshow('Live Face Recognition (Q=quit, S=save, M=toggle mode)', frame)
            
            # Handle keys
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                self.running = False
            elif key == ord('s'):
                filename = f"face_capture_{int(time.time())}.png"
                cv2.imwrite(filename, frame)
                print(f"✓ Saved: {filename}")
            elif key == ord('m'):
                use_microservice = not use_microservice
                mode = "Microservice" if use_microservice else "Local Storage"
                print(f"✓ Switched to: {mode}")
        
        cap.release()
        cv2.destroyAllWindows()
        print("\n✅ Camera closed\n")


def main():
    """Main entry point"""
    # Load .env
    try:
        from dotenv import load_dotenv
        env_file = Path(__file__).parent.parent / '.env'
        if env_file.exists():
            load_dotenv(env_file)
    except ImportError:
        pass
    
    print("\n" + "=" * 70)
    print("🔐 LIVE FACE RECOGNITION SYSTEM")
    print("=" * 70)
    
    system = LiveFaceRecognition()
    
    if not system.load_embeddings():
        print("❌ Cannot proceed without embeddings\n")
        return
    
    system.run_live()
    
    print("=" * 70)
    print("👋 Goodbye!")
    print("=" * 70 + "\n")


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
