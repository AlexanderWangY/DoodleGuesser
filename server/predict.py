import torch
from PIL import Image
import io
import base64
import numpy as np

def infer(img_string):
    img_bytes = base64.b64decode(img_string)
    image_io = io.BytesIO(img_bytes)
    image = Image.open(image_io)
    arr = np.array(image)
    print(arr.shape)
    image.save("output.jpg")
    return "SOG"