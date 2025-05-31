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
        (mqttclient.Client(os.getenv("TEMPERATURE_CLIENT_ID")), "temperature"),
        (mqttclient.Client(os.getenv("HUMIDITY_CLIENT_ID")), "humidity"),
        (mqttclient.Client(os.getenv("MOISTURE_CLIENT_ID")), "moisture"),
        (mqttclient.Client(os.getenv("LIGHT_CLIENT_ID")), "light"),
        (mqttclient.Client(os.getenv("TEST_CLIENT_ID")), "test"),
    ]

    for conf in device_configs:
        device, data_key = conf

        device.on_connect = mqtt.connected
        device.on_subscribe = mqtt.subscribed
        device.on_message = mqtt.recv_message

        if data_key == "test":
            device.connect("broker.hivemq.com", config.BROKER_PORT)
        else:
            device.connect(config.BROKER_ADDRESS, config.BROKER_PORT)

        device.loop_start()

        device.username_pw_set(
            os.getenv("COMMON_USERNAME"), os.getenv("COMMON_PASSWORD")
        )

        # Custom attributes
        device.data_key = data_key

    while True:
        value = random.randint(0, 100)

        for conf in device_configs:
            client, _ = conf
            client.publish(
                "v1/devices/me/telemetry",
                json.dumps(
                    {
                        f"value": value,
                    }
                ),
                1,
            )

        time.sleep(1)
        print("send value:", value)


if __name__ == "__main__":
    main()
