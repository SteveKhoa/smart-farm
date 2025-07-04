import sys
import os

sys.path.insert(1, os.path.join(sys.path[0], ".."))

import paho.mqtt.client as mqttclient
import json


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