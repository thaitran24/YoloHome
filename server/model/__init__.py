import config
from model.adafruit import Adafruit, AdafruitMQTT
from model.home import HomeModel
from model.room import RoomModel
from model.device import DeviceModel

adafruit_server = Adafruit(config.server.ADA_USER, config.server.ADA_KEY)