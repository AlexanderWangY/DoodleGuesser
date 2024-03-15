import torch
from torch import nn
import torch.nn.functional as F
from torchvision import transforms
from torchvision.transforms import ToTensor, Grayscale, Resize
from PIL import Image
import io
import base64
import numpy as np
import __main__
import os

# Let's define our model!

class ConvNet(nn.Module):
  def __init__(self):
    super(ConvNet, self).__init__()
    self.conv1 = nn.Conv2d(1, 32, 3, 1, 1)
    self.conv2 = nn.Conv2d(32, 64, 3, 1, 1)
    self.conv3 = nn.Conv2d(64, 128, 3, 1, 1)
    self.drop1 = nn.Dropout(.25)
    self.drop2 = nn.Dropout(.5)
    self.fc1 = nn.Linear(128 * 50 * 50, 256) # Shape gets cut in half due to max pooling! (100 x 100) -> (50 x 50)
    self.fc2 = nn.Linear(256, 128)
    self.fc3 = nn.Linear(128, 5)

  def forward(self, x):
    x = self.conv1(x)
    x = F.relu(x)
    x = self.conv2(x)
    x = F.relu(x)
    x = F.max_pool2d(x, 2)
    x = self.conv3(x)
    x = F.relu(x)
    x = self.drop1(x)
    x = torch.flatten(x, 1)
    x = self.fc1(x)
    x = F.relu(x)
    x = self.drop2(x)
    x = self.fc2(x)
    x = F.relu(x)
    x = self.fc3(x)
    output = F.log_softmax(x, dim=-1)
    return output

setattr(__main__, "ConvNet", ConvNet)

transform = transforms.Compose([
    Grayscale(),
    Resize((100, 100)),
    ToTensor()
])

def infer(img_string):
    img_bytes = base64.b64decode(img_string)
    image_io = io.BytesIO(img_bytes)
    img = Image.open(image_io)

    torch_img = transform(img).unsqueeze(0)

    model = torch.load(os.path.join("../","model/weights/best.pt"), map_location=torch.device("cpu"))

    model.eval()

    with torch.no_grad():
        pred = model(torch_img)
    
    classes = ['dog', 'fish', 'house', 'pencil', 'person']
    pred_class = classes[pred.argmax(dim=1).item()]
    return pred_class