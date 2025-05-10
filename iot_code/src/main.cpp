#include <Arduino.h>
#include <DHT20.h>
#include <Adafruit_NeoPixel.h>

uint32_t D3 = GPIO_NUM_6;

Adafruit_NeoPixel rgb(4, D3, NEO_GRB + NEO_KHZ800);

void TaskLEDControl(void *pvParameters) {

  pinMode(GPIO_NUM_48, OUTPUT); // Initialize LED pin
  int ledState = 0;
  while(1) {
    
    if (ledState == 0) {
      digitalWrite(GPIO_NUM_48, HIGH); // Turn ON LED
    } else {
      digitalWrite(GPIO_NUM_48, LOW); // Turn OFF LED
    }
    ledState = 1 - ledState;
    vTaskDelay(2000);
  }
}

void TaskLightSensor(void *pvParameters){
    while(1){
      uint16_t lightRaw = analogRead(GPIO_NUM_2);
      Serial.print("Light: "); Serial.print(lightRaw); 
      Serial.print(" % ");
      Serial.println();
      if (lightRaw < 30) {
        // send turn light on
      } else {
        // send turn light off
      }
      // push to coreiot

      vTaskDelay(4000);
    }
  
  }

void TaskLedControl(void *pvParameters){
    while(1){
        if ((analogRead(GPIO_NUM_2)/ 4096.0 < 30)) {
            rgb.fill(rgb.Color(255,255,255));
            rgb.show();
        } else {
            rgb.fill(rgb.Color(255,0,0));
            rgb.show();
        }
      vTaskDelay(300);
    }
  
  }

void TaskTemperature_Humidity(void *pvParameters){
  DHT20 dht20;
  Wire.begin(GPIO_NUM_11, GPIO_NUM_12);
  dht20.begin();
  while(1){
    dht20.read();

    double temperature = dht20.getTemperature();
    double humidity = dht20.getHumidity();

    Serial.print("Temp: "); Serial.print(temperature); Serial.print(" *C ");
    Serial.print(" Humidity: "); Serial.print(humidity); Serial.print(" %");
    Serial.println();
    
    vTaskDelay(2000);
  }

}


void setup() {
  // put your setup code here, to run once:
  Serial.begin(1152000);
  xTaskCreate(TaskLEDControl, "LED Control", 2048, NULL, 2, NULL);
  xTaskCreate(TaskLedControl, "Led light", 2048, NULL, 2, NULL);
//   xTaskCreate(TaskTemperature_Humidity, "LED Control", 2048, NULL, 2, NULL);
  xTaskCreate(TaskLightSensor, "Light Sensor", 2048, NULL, 2, NULL);
}

void loop() {
  
}