import sys
import os

sys.path.insert(1, os.path.join(sys.path[0], ".."))

from payload import water_meter
from device import config, mqtt

import paho.mqtt.client as mqttclient
import time


def main():
    client = mqttclient.Client(config.SOIL_MOISTURE_1_CLIENT_ID)
    client.username_pw_set(config.SOIL_MOISTURE_1_ACCESS_USERNAME, config.SOIL_MOISTURE_1_ACCESS_TOKEN)
    client.on_connect = mqtt.connected
    client.on_subscribe = mqtt.subscribed
    client.on_message = mqtt.recv_message

    client.connect(config.BROKER_ADDRESS, config.BROKER_PORT)
    client.loop_start()

    battery = 99
    pulse_counter = 130000

    while True:
        battery += 1
        pulse_counter += 157

        collect_data = water_meter.PayloadWaterMeter(battery, pulse_counter)

        mqtt.send_message(client, collect_data.serialize())
        
        time.sleep(1)


if __name__ == "__main__":
    main()