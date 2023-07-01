import sys

import numpy as np
import cv2

def main(image_buffer):
    # Convert image bytes to an OpenCV image
    image_array = np.frombuffer(image_buffer, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    # Create a QR code detector
    detector = cv2.QRCodeDetector()
    
    # Detect and decode QR codes
    retval, info, points, _ = detector.detectAndDecodeMulti(image)

    if retval is False:
        raise ValueError("No QR Code found")

    return info[0]

if __name__ == '__main__':
    arguments = sys.argv[1:]

    image_buffer = sys.stdin.buffer.read()
    result = main(image_buffer)
    
    print(result)
    sys.stdout.flush()