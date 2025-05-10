import dataclasses
from typing import Dict, Any


@dataclasses.dataclass
class PayloadSoilMoistureSensor:
    battery: int
    moisture: int

    def serialize(self) -> Dict[str, Any]:
        return {
            "battery": self.battery,
            "moisture": self.moisture
        }


if __name__ == "__main__":
    # Example usage
    payload = PayloadSoilMoistureSensor(99, 57)
    print(payload.serialize())