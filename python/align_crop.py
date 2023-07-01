import sys
import json

import numpy as np
import cv2

from detect_markers import main as detect_markers

def main(image_buffer, src_markers):
    # Convert image bytes to an OpenCV image
    image_array = np.frombuffer(image_buffer, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    factor = 4
    width, height = 595 * factor, 842 * factor

    corners = []
    for target_key in [1, 2, 11, 9]:
        src_marker = next((src_marker for src_marker in src_markers if src_marker['id'] == target_key), None)
        if src_marker is not None:
            corners.append(src_marker['postions'])

    src_points = np.array(corners, dtype=np.float32)
    dest_points = np.array([[70, 70], [width -74, 70], [width - 74, height - 74] , [70, height - 74]], dtype=np.float32)
    # raise ValueError(src_points, dest_points)

    transform_matrix = cv2.getPerspectiveTransform(src_points, dest_points)
    cropped_image = cv2.warpPerspective(image, transform_matrix, (width, height))

    # TODO: Homographs
    success, encoded_image = cv2.imencode('.jpg', cropped_image)
    src_markers = detect_markers(encoded_image.tobytes())
    src_markers = [element for element in src_markers if element["id"] in [3,5,7,9,11]]
    # raise ValueError(src_markers)
    dest_markers = [
        {'id': 1, 'postions': [70.0, 70.0]}, 
        {'id': 2, 'postions': [2306.0, 70.0]}, 
        {'id': 3, 'postions': [70.0, 390.5]}, 
        {'id': 4, 'postions': [1188.0, 390.5]}, 
        {'id': 5, 'postions': [2306.0, 390.5]}, 
        {'id': 6, 'postions': [70.25, 1842.25]}, 
        {'id': 7, 'postions': [1188.25, 1842.25]}, 
        {'id': 8, 'postions': [2306.25, 1842.25]}, 
        {'id': 9, 'postions': [70.0, 3294.0]}, 
        {'id': 10, 'postions': [1188.0, 3294.0]}, 
        {'id': 11, 'postions': [2306.0, 3294.0]}
    ]

    src_points = []
    dest_points = []
    # matches = []

    for index, src_marker in enumerate(src_markers):
        dest_marker = next((dest_marker for dest_marker in dest_markers if dest_marker['id'] == src_marker['id']), None)
        if dest_marker is not None:
            src_points.append(src_marker['postions'])
            dest_points.append(dest_marker['postions'])
            # matches.append((index, index))

    src_points = np.array(src_points)
    dest_points = np.array(dest_points)
    
    # raise ValueError(src_points, dest_points)
    # Estimate the homography matrix using RANSAC algorithm
    homography, _ = cv2.findHomography(src_points, dest_points, cv2.RANSAC, 5.0)
    # Warp the source image to align with the destination image using the homography matrix
    warped_image = cv2.warpPerspective(cropped_image, homography, (width, height))

    return warped_image

if __name__ == '__main__':
    arguments = sys.argv[1:]

    image_buffer = sys.stdin.buffer.read()
    image = main(image_buffer, json.loads(arguments[0]))

    success, encoded_image = cv2.imencode('.jpg', image)
    if success:
        sys.stdout.buffer.write(encoded_image.tobytes())
    sys.stdout.flush()