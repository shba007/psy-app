import sys
import json

import numpy as np
import cv2
from cv2 import aruco

def main(image_buffer, findNecessary=True):
    # Convert image bytes to an OpenCV image
    image_array = np.frombuffer(image_buffer, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.convertScaleAbs(image, alpha=1.5, beta=0)
    # Create a sharpening kernel
    kernel = np.array([[-1, -1, -1],
                    [-1,  9, -1],
                    [-1, -1, -1]])

    # Apply the sharpening kernel to the image
    image = cv2.filter2D(image, -1, kernel)

    # Define the dictionary for ArUco markers
    aruco_dict = aruco.getPredefinedDictionary(aruco.DICT_4X4_100)
    parameters = aruco.DetectorParameters()

    # Detect ArUco markers
    corners, ids, rejected = aruco.detectMarkers(image=image, dictionary=aruco_dict, parameters=parameters)

    # Check if any markers are detected
    if ids is None:
        raise ValueError("No ArUco markers found")

    sufficient = sum(num in ids for num in [1, 2, 9, 11]) >= 4

    if not (sufficient) and findNecessary:
        raise ValueError(f"ArUco Corner markers not found, only found {ids}")

    markers = [{"id": id[0].tolist(), "postions": [float(np.mean(corner[0, :, 0])), float(np.mean(corner[0, :, 1]))]} for id, corner in zip(ids, corners)]
    # markers = [{"id": id[0].tolist(), "corners": corner[0].tolist()} for id, corner in zip(ids, corners)]
    markers.sort(key=lambda x: x["id"])

    return markers

if __name__ == "__main__":
    arguments = sys.argv[1:]

    image_buffer = sys.stdin.buffer.read()
    # image_buffer = []
    result = main(image_buffer)
    
    print(json.dumps(result))
    sys.stdout.flush()