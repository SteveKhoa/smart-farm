import sys
import os
import random
import json

sys.path.insert(1, os.path.join(sys.path[0], ".."))

from payload import soil_moisture
from device import config, mqtt

import paho.mqtt.client as mqttclient
import time


def main():
    device_configs = [
        (mqttclient.Client(), "temperature", os.getenv("TEMPERATURE_ACCESS_TOKEN")),
        (mqttclient.Client(), "humidity", os.getenv("HUMIDITY_ACCESS_TOKEN")),
        (mqttclient.Client(), "moisture", os.getenv("MOISTURE_ACCESS_TOKEN")),
        (mqttclient.Client(), "light", os.getenv("LIGHT_ACCESS_TOKEN")),
    ]

    for conf in device_configs:
        device, data_key, access_token = conf

        device.on_connect = mqtt.connected
        device.on_subscribe = mqtt.subscribed
        device.on_message = mqtt.recv_message

        device.username_pw_set(
            access_token, None
        )

        device.connect(config.BROKER_ADDRESS, config.BROKER_PORT)
            
        device.loop_start()

        # Custom attributes
        device.data_key = data_key

    while True:
        if device.is_connected():
            break
        print("connecting...")
        time.sleep(1.0)

    while True:
        value = random.randint(0, 100)

        for conf in device_configs:
            client, _, _ = conf
            client.publish(
                "v1/devices/me/telemetry",
                json.dumps(
                    {
                        "value": value,
                        "criticalAlarmsCount": 0,
                        "majorAlarmsCount": 0,
                    }
                ),
                1,
            )

        time.sleep(1)
        print("send value:", value)


if __name__ == "__main__":
    main()
