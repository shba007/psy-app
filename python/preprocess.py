import sys

import numpy as np
import cv2

def main(image_buffer):
    # Convert image bytes to an OpenCV image
    image_array = np.frombuffer(image_buffer, np.uint8)
    target_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    target_image = cv2.cvtColor(target_image, cv2.COLOR_BGR2GRAY)
    _, target_image = cv2.threshold(target_image, 64, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    return target_image

if __name__ == '__main__':
    arguments = sys.argv[1:]

    image_buffer = sys.stdin.buffer.read()
    image = main(image_buffer)

    success, encoded_image = cv2.imencode('.jpg', image)
    if success:
        sys.stdout.buffer.write(encoded_image.tobytes())
    sys.stdout.flush()