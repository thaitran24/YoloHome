import sys
from Adafruit_IO import MQTTClient

import random
import time

from api_key import *


"""MQTT PROTOCOL"""
def connected(client):
    print("Connected successfully...")
    for feed in AIO_FEED_ID:
        client.subscribe(feed)
    for feed in AIO_FEED_ID2:
        client.subscribe(feed)



def subscribe(client, userData, mid, granted_qos):
    print("Subscribe successfully...")


def disconnected(client):
    print("Disconnected...")
    sys.exit(1)

# def processData()


def message(client, feed_id, payload):
    print("Get data: " + feed_id + ' ' + payload)



if __name__ == '__main__':

    """GATEWAY CONFIGURATION"""
    client = MQTTClient(AIO_USERNAME, AIO_KEY)
    client.on_connect = connected
    client.on_disconnect = disconnected
    client.on_message = message
    client.on_subscribe = subscribe
    client.connect()
    client.loop_background()

    while True:
        value = random.randint(0, 100)
        print('Update:', value)

        client.publish('yolohome-full.lightsensor', value)
        client.publish('yolohome-full.humidsensor', value)
        client.publish('yolohome-full.tempsensor', value/2)
        client.publish('yolohome-full.led1', value%2)
        client.publish('yolohome-nosensor.fan', value%5 * 25)




        time.sleep(15)