import sys
import os

sys.path.insert(1, os.path.join(sys.path[0], ".."))


BROKER_ADDRESS = os.getenv("COREIOT_BROKER_ADDRESS")
BROKER_PORT = int(os.getenv("COREIOT_BROKER_PORT"))
CLIENT_ID = os.getenv("SI_WATER_METER_1_CLIENT_ID")
ACCESS_USERNAME = os.getenv("SI_WATER_METER_1_CLIENT_USERNAME")
ACCESS_TOKEN = os.getenv("SI_WATER_METER_1_CLIENT_PASSWORD")