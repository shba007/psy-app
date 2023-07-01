import sys
import json

import numpy as np
import cv2
from scipy.optimize import linear_sum_assignment

def is_circle_inside(circle_center):
     # from markers 3,5,11,9
    boundary = [
        [70.0, 390.5], 
        [2306.0, 390.5], 
        [2306.0, 3294.0],
        [70.0, 3294.0], 
    ]

    x, y = circle_center
    x_min, y_min = boundary[0]
    x_max, y_max = boundary[2]

    if x_min <= x <= x_max and y_min <= y <= y_max:
        return True
    else:
        return False

def main(image_buffer, inputs):
    # Convert image bytes to an OpenCV image
    image_array = np.frombuffer(image_buffer, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Apply Gaussian blur to reduce noise
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Increase the contrast
    contrasted = cv2.convertScaleAbs(blurred, alpha=1.5, beta=0)

    # Apply HoughCircles to detect circles
    circles = cv2.HoughCircles(
        contrasted,
        cv2.HOUGH_GRADIENT,
        dp=1,
        minDist=50,
        param1=50,
        param2=30,
        minRadius=5,
        maxRadius=50
    )

    dest_circles = []
    # If circles are detected
    if circles is not None:
        # Convert the circles to integer coordinates
        circles = np.round(circles[0, :]).astype(int)

        # Draw circles and centers on the image
        for (x, y, r) in circles:
            if is_circle_inside((x,y)):
                dest_circles.append((x,y))

    # Find the circle in image buffer
    src_circles = np.array([choice["chord"] for data in inputs for choice in data["choices"]])
    dest_circles = np.array(dest_circles)
    
    # Compute the pairwise distances between circles in the two sets
    try:
        distances = np.linalg.norm(src_circles[:, np.newaxis] - dest_circles, axis=-1)
    except:
        raise ValueError("unable to calculate distances", src_circles.shape, dest_circles.shape)

    # Solve the assignment problem using the Hungarian algorithm
    row_indices, col_indices = linear_sum_assignment(distances)

    # Retrieve the optimal matching pairs
    matched_pairs = [(i, j) for i, j in zip(row_indices, col_indices)]

    for i in range(len(inputs)):
        for j in range(len(inputs[i]["choices"])):
            inputs[i]["choices"][j]["chord"] = None
    
    for pair in matched_pairs:
        index = pair[0]
        inputs[index//2]['choices'][index%2]['chord'] = dest_circles[pair[1]].tolist()
    
    return inputs

if __name__ == '__main__':
    arguments = sys.argv[1:]

    image_buffer = sys.stdin.buffer.read()
    result = main(image_buffer, json.loads(arguments[0]))

    print(json.dumps(result))
    sys.stdout.flush()