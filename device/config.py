import sys
import os

sys.path.insert(1, os.path.join(sys.path[0], ".."))


BROKER_ADDRESS = os.getenv("COREIOT_BROKER_ADDRESS")
BROKER_PORT = int(os.getenv("COREIOT_BROKER_PORT"))

WORKING_DIRECTORY = os.getenv("WORKING_DIR")