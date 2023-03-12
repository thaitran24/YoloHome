import sys
from Adafruit_IO import MQTTClient, Client
import serial.tools.list_ports
import random
import time

class gatewayConfig:
    mess = ""
    isYolobitConnected = False
    def __init__(self, aio_username, aio_key) -> None:
        self.aio_username = aio_username
        self.aio_key = aio_key

        self.client = Client(self.aio_username, self.aio_key)
        self.mqttclient = MQTTClient(self.aio_username, self.aio_key)

        # retrieve feed ids from Client
        self.aio_feed_id = [f.key for f in self.client.feeds()]

        self.__callback()
        self.mess = ""
        self.ser = serial.Serial(port=self.getPort(), baudrate=115200)

    def __callback(self):
        """Connect the callback methods defined above to Adafruit IO"""
        self.mqttclient.on_connect = self.__connected
        self.mqttclient.on_disconnect = self.__disconnected
        self.mqttclient.on_message = self.__message
        self.mqttclient.on_subscribe = self.__subscribe
        self.mqttclient._client.on_unsubscribe = self.__unsubscribe

    def __connected(self, client):
        # Connected function will be called when the client is connected to Adafruit IO.
        print("Connected successfully...")
        for feed in self.aio_feed_id:
            client.subscribe(feed)

    def __subscribe(self, client, userData, topic, granted_qos):
        # This method is called when the client subscribes to a new feed.
        print("Subscribed to {0} with QOS level {1}".format(topic, granted_qos))

    def __unsubscribe(self, client, userData, topic, pid):
        # This method is called when the client unsubscribes from a feed.
        print("Unsubscribed from {0} with PID {1}".format(topic, pid))

    def __disconnected(self, client):
        # Disconnected function will be called when the client disconnects.        
        print("Disconnected...")
        sys.exit(1)

    def __message(self, client, feed_id, payload):
        # Message function will be called when a subscribed feed has a new value.
        # The feed_id parameter identifies the feed, and the payload parameter has
        # the new value.
        print("Feed {0} received new value: {1}".format(feed_id, payload))
        if self.isYolobitConnected:
            if (feed_id=='yolohome-full.led1'):
                self.ser.write(('L').encode())
            elif (feed_id=='yolohome-nosensor.fan'):
                self.ser.write(str(payload).encode())
            elif (feed_id=='yolohome-nosensor.servo'):
                self.ser.write(('D').encode())
            elif (feed_id=='yolohome-full.led2'):
                self.ser.write(('S').encode())
        # return ['yolohome-full.led1',
        #       'yolohome-nosensor.fan', 'yolohome-nosensor.servo']
    # def getDatatoSerial(self):
        # return [self.client.receive(feed) for feed in self.mapId(is_published=False)]

    def getData(self, feed_id):
        return self.client.receive(feed_id)

    def getPort(self):
        ports = serial.tools.list_ports.comports()
        length = len(ports)
        commPort = "None"
        for i in range(0, length):
            port = ports[i]
            strPort = str(port)
            if "USB Serial Device" in strPort:
                splitPort = strPort.split(" ")
                commPort = (splitPort[0])
        return commPort

    def checkConnect(self):
        if self.getPort() != "None":
            self.ser = serial.Serial(port=self.getPort(), baudrate=115200)
            self.isYolobitConnected = True

    def process(self, data):
        data = data.replace("!", "")
        data = data.replace("#", "")
        splitData = data.split(":")
        if (len(splitData)>3):
            value = [splitData[1], splitData[3], splitData[5]]
        else:
            value = splitData[1]

        return value

    def getDataFromSerial(self):
        bytesToRead = self.ser.inWaiting()
        sensorValue = 0
        if (bytesToRead > 0):
            self.mess = self.mess + self.ser.read(bytesToRead).decode("UTF-8")
            while ("#" in self.mess) and ("!" in self.mess):
                start = self.mess.find("!")
                end = self.mess.find("#")
                sensorValue = self.process(self.mess[start:end+1])
                if (end==len(self.mess)):
                    self.mess=""
                else:
                    self.mess = self.mess[end+1:]
        return sensorValue

    def publishData(self, value=None):
        # Collect data and publish it to Adafruit Server

        if value is not None:
            for id, value in zip(self.mapId(), value):
                self.mqttclient.publish(id, value)
        else:
            data = []

            value = random.randint(0, 100)
            print('Update:', value)

            data.append(value%5 * 25)           # Fan: 0, 25, 50, 75, 100
            data.append(value%2)                # Servo: 0, 1
            data.extend([value%2, (value+1)%2]) # led1, led2: 0, 1
            data.append(value)                  # light sensor (0-100)
            data.append(value)                  # humid sensor (0-100)
            data.append(value)                  # temperature (0-100)

            # Publish data with specific feed_id
            for id, value in zip(self.aio_feed_id, data):
                self.mqttclient.publish(id, value)

    def mapId(self, is_published=True):
        # if is_published:
        return ['yolohome-full.tempsensor', 'yolohome-full.humidsensor',
                'yolohome-full.led1', 'yolohome-full.momentumsensor',
                'yolohome-nosensor.fan', 'yolohome-nosensor.servo'
                'yolohome-full.lightsensor', 'yolohome-full.led2']
        # else:
        #     return [ 'yolohome-full.led1', 'yolohome-full.led2',
        #              'yolohome-nosensor.fan', 'yolohome-nosensor.servo']

    def run(self):
        self.mqttclient.connect()
        self.mqttclient.loop_background()

        while True:
            # Send new message to Adafruit
            value = self.getDataFromSerial()
            if len(value)==1: # Detect hooman
                self.mqttclient.publish('yolohome-full.momentumsensor', 1)
            elif len(value)==3:
                self.publishData(value)


            # Check if feed is registered or disabled
            new_aio_feed_id = [f.key for f in self.client.feeds()]

            if set(new_aio_feed_id) != set(self.aio_feed_id):
                new_feeds = [feed for feed in new_aio_feed_id if feed not in self.aio_feed_id]
                old_feeds = [feed for feed in self.aio_feed_id if feed not in new_aio_feed_id]

                for feed in old_feeds:
                    print("Disconnected feed:", feed)
                    self.mqttclient.unsubscribe(feed)
                for feed in new_feeds:
                    print("New feed:", feed)
                    self.mqttclient.subscribe(feed)

            self.aio_feed_id = new_aio_feed_id


if __name__ == "__main__":
    print("Gateway Configuration Utility")