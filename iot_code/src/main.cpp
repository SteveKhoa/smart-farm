
#include <WiFi.h>
#include <Arduino_MQTT_Client.h>
#include <ThingsBoard.h>
#include <DHT20.h>
#include "Wire.h"
#include <ArduinoOTA.h>
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <string>

using namespace std;
#define LED_PIN 48

constexpr char WIFI_SSID[] = "Tung";
constexpr char WIFI_PASSWORD[] = "concutao";

constexpr char TOKEN[] = "HI4W8GwHv8X1IFLLtTLr";

uint32_t D3 = GPIO_NUM_6;
uint32_t A1 = GPIO_NUM_2;

constexpr uint32_t MAX_MESSAGE_SIZE = 1024U;
constexpr uint32_t SERIAL_DEBUG_BAUD = 115200U;

constexpr char THINGSBOARD_SERVER[] = "app.coreiot.io";
constexpr uint16_t THINGSBOARD_PORT = 1883U;

WiFiClient wifiClient;
Arduino_MQTT_Client mqttClient(wifiClient);
ThingsBoard tb(mqttClient, MAX_MESSAGE_SIZE);

volatile bool attributesChanged = false;
volatile bool ledState = false;
volatile uint16_t lightPercent = 50;

constexpr char LEDLIGHT_ATTR[] = "ledLight";

// constexpr std::array<const char *, 2U> SHARED_ATTRIBUTES_LIST = {
//   LED_STATE_ATTR,
//   BLINKING_INTERVAL_ATTR
// };

DHT20 dht20;

class MySensor {
public:
    const string token;  // Preferred for most use cases
    const string name;
    const string key;
    WiFiClient wifiClient;
    Arduino_MQTT_Client mqttClient;
    const uint32_t MAX_MESSAGE_SIZE = 1024U;
    const char THINGSBOARD_SERVER[256] = "app.coreiot.io";
    const uint16_t THINGSBOARD_PORT = 1883U;
    ThingsBoard tb;

    MySensor(const string& token, string name) : token(token), name(name), mqttClient(wifiClient), tb(mqttClient, MAX_MESSAGE_SIZE) {
    }

    bool connect(){
      // tb.connect(THINGSBOARD_SERVER, token, THINGSBOARD_PORT);
      // Serial.println(token.c_str());
      if (!tb.connect(THINGSBOARD_SERVER, token.c_str(), THINGSBOARD_PORT)) {
          string error_mess =  "Failed to connect " + name;
          Serial.println(error_mess.c_str());
          return false;
        }

        tb.sendAttributeData("macAddress", WiFi.macAddress().c_str());

        return true;
    }
    
    template<typename T>
    void sendTelementry(string key, T data){
      tb.sendTelemetryData(key.c_str(), data);
    }


};

MySensor temperature_sensor("oj1lj5xj83IHVbNyUlmm", "temp_sen");
MySensor humidity_sensor("9u79sgUI91RSW6l7xKTq", "hum_sen");

// RPC_Response setLedSwitchState(const RPC_Data &data) {
//     Serial.println("Received Switch state");
//     bool newState = data;
//     Serial.print("Switch state change: ");
//     Serial.println(newState);
//     digitalWrite(LED_PIN, newState);
//     attributesChanged = true;

//     return RPC_Response("setLedSwitchValue", newState); // RPC_Response(key: str, value)
// }

RPC_Response setLedLight(const RPC_Data &data) {
    // neu ddc thif sd rule chain tuwf core iot ddeer mowr ddeefn 
    Serial.println("Received led light");
    // bool data_parse = data;
    uint16_t light_percent = data;
    Serial.print("Switch state change: ");
    // Serial.println(newState);
    attributesChanged = true;

    return RPC_Response("setLedLightValue", light_percent); // RPC_Response(key: str, value)
}

const std::array<RPC_Callback, 1U> callbacks = {
  RPC_Callback{ "setLedLight", setLedLight }
};

void processSharedAttributes(const Shared_Attribute_Data &data) {
  for (auto it = data.begin(); it != data.end(); ++it) {
    if (strcmp(it->key().c_str(), LEDLIGHT_ATTR) == 0) {
      //process LEDLIGHT_ATTR
      // neu ddc thif sd rule chain tuwf core iot ddeer mowr ddeefn 
      const uint16_t newLightPercent = it->value().as<uint16_t>();
      if (newLightPercent >= 0 && newLightPercent <= 100) {
        lightPercent = newLightPercent;
        Serial.print("Blinking interval is set to: ");
        Serial.println(newLightPercent);
      }

    } 
  }
  attributesChanged = true;
}

void InitWiFi() {
  Serial.println("Connecting to AP ...");
  // Attempting to establish a connection to the given WiFi network
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    // Delay 500ms until a connection has been successfully established
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to AP");
}

void taskWifiControl(void *pvParameters) {
  delay(10);
  Serial.println("taskWifiControl started");
  wl_status_t status = WiFi.status();
  while(1) {
    status = WiFi.status();
    if (status != WL_CONNECTED) {
        InitWiFi();
        Serial.print("Reconnecting...");
    }
    else{
      Serial.print("Wifi is connected");
    }
    // Serial.print("Checking wifi...");
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void taskCoreIoTConnect(void *pvParameters) {
  while(1) {
    if (WiFi.status() != WL_CONNECTED) {
    }  
    else if (!tb.connected()) {
      Serial.print("Connecting to: ");
      Serial.print(THINGSBOARD_SERVER);
      // Serial.print(" with token ");
      // Serial.println(TOKEN);

      temperature_sensor.connect();
      humidity_sensor.connect();
      // if (!tb.connect(THINGSBOARD_SERVER, TOKEN, THINGSBOARD_PORT)) {
      //   Serial.println("Failed to connect");
      //   return;
      // }
      // if (!tb.connect(THINGSBOARD_SERVER, TOKEN2, THINGSBOARD_PORT)) {
      //   Serial.println("Failed to connect");
      //   return;
      // }

      // tb.sendAttributeData("macAddress", WiFi.macAddress().c_str());

      // no attribute and RPC currently

      // Serial.println("Subscribing for RPC...");
      // if (!tb.RPC_Subscribe(callbacks.cbegin(), callbacks.cend())) {
      //   Serial.println("Failed to subscribe for RPC");
      //   return;
      // }

      // if (!tb.Shared_Attributes_Subscribe(attributes_callback)) {
      //   Serial.println("Failed to subscribe for shared attribute updates");
      //   return;
      // }

      // Serial.println("Subscribe done");

      // if (!tb.Shared_Attributes_Request(attribute_shared_request_callback)) {
      //   Serial.println("Failed to request for shared attributes");
      //   return;
      // }
    }

    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
  
}


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
    vTaskDelay(1000);
    // Serial.print("change led");
  }
}

void taskThingsBoard(void *pvParameters) {
  while(1) {
    if (WiFi.status() == WL_CONNECTED) {
      tb.loop();
    }

    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }

}

void TaskLightSensor(void *pvParameters){
    while(1){
      uint16_t lightRaw = analogRead(A1);
      Serial.print("Light: "); Serial.print(lightRaw); 
      Serial.print(" % ");
      Serial.println();
      if (lightRaw < 30) {
        // khong thif code thnawgf treen ddaay lum
        ledState = true;
        // send turn light on
      } else {
        ledState = false;
        // send turn light off
      }
      // push to coreiot

      vTaskDelay(5000);
    }
  
  }

void TaskLedLightControl(void *pvParameters){
    while(1){
        // can change the intensity of the light to be more bright
        float rgb_num = lightPercent / 100.0 * 255.0;
        if (ledState) {
            rgb.fill(rgb.Color(rgb_num,rgb_num,rgb_num));
            rgb.show();
        } else {
            rgb.fill(rgb.Color(0,0,0));
            rgb.show();
        }
      vTaskDelay(2000);
    }
  
  }

void TaskTemperature_Humidity(void *pvParameters){

  Wire.begin(GPIO_NUM_11, GPIO_NUM_12);
  dht20.begin();
  while(1){
    dht20.read();

    double temperature = dht20.getTemperature();
    double humidity = dht20.getHumidity();


    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("Failed to read from DHT20 sensor!");
      } else {
        Serial.print("Temp: "); Serial.print(temperature); Serial.print(" *C ");
        Serial.print(" Humidity: "); Serial.print(humidity); Serial.print(" %");
        Serial.println();

        temperature_sensor.sendTelementry("temperature", temperature);
        humidity_sensor.sendTelementry("humidity", humidity);

        // tb.sendTelemetryData("temperature", temperature);
        // tb.sendTelemetryData("humidity", humidity);
      }
    
    vTaskDelay(2000);
  }

}


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  // Serial.print(" hello ");
  // xTaskCreate(TaskLEDControl, "LED Control", 2048, NULL, 2, NULL);
  xTaskCreate(TaskLedLightControl, "Led light", 2048, NULL, 2, NULL);
  xTaskCreate(TaskTemperature_Humidity, "LED Control", 2048, NULL, 2, NULL);
  xTaskCreate(TaskLightSensor, "Light Sensor", 2048, NULL, 2, NULL);
  xTaskCreate(taskWifiControl, "Wifi Control", 4096, NULL, 2, NULL);
  xTaskCreate(taskCoreIoTConnect, "Core IoT Connect", 4096, NULL, 2, NULL);
  xTaskCreate(taskThingsBoard, "ThingsBoard", 4096, NULL, 2, NULL);
}

void loop() {
  
}