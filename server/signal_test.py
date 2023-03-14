import time
import os
from config import *
from dotenv import load_dotenv
from model import Adafruit

load_dotenv()

ada_io = Adafruit(os.getenv(ADA_USER), os.getenv(ADA_KEY))

# Test light
light_key = ''

keys = ['yolohome-full.humidsensor', 
        'yolohome-full.led1', 
        'yolohome-full.led2', 
        'yolohome-full.lightsensor', 
        'yolohome-full.tempsensor', 
        'yolohome-full.momentumsensor']

keys = ['yolohome-full.led1', 
        'yolohome-full.led2',
        'yolohome-nosensor.fan', 
        'yolohome-nosensor.servo']


# time.sleep(10)

# for key in keys:
#     ada_io.send_data(feed_key=key, data=1)