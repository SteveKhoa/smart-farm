import sys
import os

sys.path.insert(1, os.path.join(sys.path[0], ".."))

from payload import water_meter

import paho.mqtt.client as mqttclient
import time
import json


BROKER_ADDRESS = os.getenv("COREIOT_BROKER_ADDRESS")
BROKER_PORT = int(os.getenv("COREIOT_BROKER_PORT"))
CLIENT_ID = os.getenv("SI_WATER_METER_1_CLIENT_ID")
ACCESS_USERNAME = os.getenv("SI_WATER_METER_1_CLIENT_USERNAME")
ACCESS_TOKEN = os.getenv("SI_WATER_METER_1_CLIENT_PASSWORD")


def subscribed(client, userdata, mid, granted_qos):
    print("Subscribed...")


def recv_message(client, userdata, message):
    print("Received: ", message.payload.decode("utf-8"))
    temp_data = {'value': True}
    try:
        jsonobj = json.loads(message.payload)
        if jsonobj['method'] == "setValue":
            temp_data['value'] = jsonobj['params']
            client.publish('v1/devices/me/attributes', json.dumps(temp_data), 1)
    except:
        pass


def send_message(client: mqttclient.Client, payload):
    client.publish('v1/devices/me/telemetry', json.dumps(payload), 1)
    print("send message: json.dumps(payload)")


def connected(client, usedata, flags, rc):
    if rc == 0:
        print("Connected successfully!!")
        client.subscribe("v1/devices/me/rpc/request/+")
    else:
        print(f"connected: usedata={usedata}, flags={flags}, rc={rc}")
        print("Connection is failed")    


def main():
    client = mqttclient.Client(CLIENT_ID)
    print(ACCESS_USERNAME)
    print(ACCESS_TOKEN)
    client.username_pw_set(ACCESS_USERNAME, ACCESS_TOKEN)
    client.on_connect = connected
    client.on_subscribe = subscribed
    client.on_message = recv_message

    client.connect(BROKER_ADDRESS, BROKER_PORT)
    client.loop_start()

    battery = 99
    pulse_counter = 130000

    while True:
        battery += 1
        pulse_counter += 157

        collect_data = water_meter.PayloadWaterMeter(battery, pulse_counter)

        send_message(client, collect_data.serialize())
        
        time.sleep(1)


if __name__ == "__main__":
    main()