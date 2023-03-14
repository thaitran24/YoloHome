import config
from model import AdafruitMQTT

if __name__=="__main__":
    mqtt_client = AdafruitMQTT(username=config.server.ADA_USER, key=config.server.ADA_KEY)
    mqtt_client.run()

