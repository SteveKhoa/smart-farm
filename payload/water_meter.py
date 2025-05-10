import dataclasses

@dataclasses.dataclass
class PayloadWaterMeter:
    battery: int
    pulse_counter: int

    def serialize(self):
        return {
            "battery": self.battery,
            "pulseCounter": self.pulse_counter
        }
    

if __name__ == "__main__":
    payload = PayloadWaterMeter(99, 12300)
    print(payload.serialize())