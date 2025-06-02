
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

constexpr char WIFI_SSID[] = "ACLAB";
constexpr char WIFI_PASSWORD[] = "ACLAB2023";

constexpr char TOKEN[] = "HI4W8GwHv8X1IFLLtTLr";

uint32_t D3 = GPIO_NUM_6;
uint32_t A1 = GPIO_NUM_2;
uint32_t A2 = GPIO_NUM_3;

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

constexpr char LED_LIGHT_ATTR[] = "ledLight";
constexpr char LED_STATE_ATTR[] = "ledState";

constexpr std::array<const char *, 2U> SHARED_ATTRIBUTES_LIST = {
  LED_LIGHT_ATTR,
  LED_STATE_ATTR
};

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

    bool connect(const std::array<RPC_Callback, 1U>& callbacks){
      // tb.connect(THINGSBOARD_SERVER, token, THINGSBOARD_PORT);
      // Serial.println(token.c_str());
      if (!tb.connect(THINGSBOARD_SERVER, token.c_str(), THINGSBOARD_PORT)) {
          string error_mess =  "Failed to connect " + name;
          Serial.println(error_mess.c_str());
          return false;
        }

        tb.sendAttributeData("macAddress", WiFi.macAddress().c_str());

        if (!tb.RPC_Subscribe(callbacks.cbegin(), callbacks.cend())) {
          Serial.println("Failed to subscribe for RPC");
          return false;
        }

        return true;
    }
    
    template<typename T>
    void sendTelementry(string key, T data){
      tb.sendTelemetryData(key.c_str(), data);
    }




};

MySensor temperature_sensor("2u73g6p3h425daexcblr", "temp_sen");
MySensor humidity_sensor("3p4a6nd20ra3p63dxf9x", "hum_sen");
MySensor light_sensor("xt1su5n30nrhoknfgxon", "light_sen");
MySensor moisture_sensor("y7v1dua3xl7tru6fbnik", "moist_sen");
MySensor led_light("zhwNixSfjHBN0OD03Npt", "led_light");
// y7v1dua3xl7tru6fbnik
// RPC_Response setLedSwitchState(const RPC_Data &data) {
//     Serial.println("Received Switch state");
//     bool newState = data;
//     Serial.print("Switch state change: ");
//     Serial.println(newState);
//     digitalWrite(LED_PIN, newState);
//     attributesChanged = true;

//     return RPC_Response("setLedSwitchValue", newState); // RPC_Response(key: str, value)
// }

RPC_Response setLedValue123(const RPC_Data &data) {
    // neu ddc thif sd rule chain tuwf core iot ddeer mowr ddeefn 
    Serial.println("Received led light");
    // bool data_parse = data;
    float light_percent = data;

    Serial.print("Switch state change: ");
    // Serial.println(newState);
    attributesChanged = true;

    return RPC_Response("setLedValue123", light_percent); // RPC_Response(key: str, value)
}

const std::array<RPC_Callback, 1U> callbacks = {
  RPC_Callback{ "setLedValue123", setLedValue123 }
};

// void processSharedAttributes(const Shared_Attribute_Data &data) {
//   for (auto it = data.begin(); it != data.end(); ++it) {
//     if (strcmp(it->key().c_str(), LED_LIGHT_ATTR) == 0) {
//       //process LED_LIGHT_ATTR
//       // neu ddc thif sd rule chain tuwf core iot ddeer mowr ddeefn 
//       const uint16_t newLightPercent = it->value().as<uint16_t>();
//       if (newLightPercent >= 0 && newLightPercent <= 100) {
//         lightPercent = newLightPercent;
//         Serial.print("Blinking interval is set to: ");
//         Serial.println(newLightPercent);
//       }

//     } 
//     if (strcmp(it->key().c_str(), LED_STATE_ATTR) == 0) {
//       //process LED_STATE_ATTR
//       // neu ddc thif sd rule chain tuwf core iot ddeer mowr ddeefn 
//       const bool lightState = it->value().as<uint16_t>();
//       ledState = true;
      

//     } 
//   }
//   attributesChanged = true;
// }

// const Shared_Attribute_Callback attributes_callback(&processSharedAttributes, SHARED_ATTRIBUTES_LIST.cbegin(), SHARED_ATTRIBUTES_LIST.cend());
// const Attribute_Request_Callback attribute_shared_request_callback(&processSharedAttributes, SHARED_ATTRIBUTES_LIST.cbegin(), SHARED_ATTRIBUTES_LIST.cend());

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
      // Serial.print("Wifi is connected");s
    }
    // Serial.print("Checking wifi...");
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void taskCoreIoTConnect(void *pvParameters) {
  MySensor* sensor = (MySensor*)pvParameters;

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
      light_sensor.connect();
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

      Serial.println("Subscribing for RPC...");
      if (!tb.RPC_Subscribe(callbacks.cbegin(), callbacks.cend())) {
        Serial.println("Failed to subscribe for RPC");
        return;
      }

      // if (!tb.Shared_Attributes_Subscribe(attributes_callback)) {
      //   Serial.println("Failed to subscribe for shared attribute updates");
      //   return;
      // }

      Serial.println("Subscribe done");

      // if (!tb.Shared_Attributes_Request(attribute_shared_request_callback)) {
      //   Serial.println("Failed to request for shared attributes");
      //   return;
      // }
    }

    while(1) {
    if (WiFi.status() != WL_CONNECTED) {
      // Wait for WiFi connection
    }  
    else if (!sensor->tb.connected()) {
      Serial.print("Connecting sensor: ");
      Serial.print(sensor->name.c_str());
      Serial.print(" to: ");
      Serial.println(sensor->THINGSBOARD_SERVER);
      
      if (!sensor->connect(callbacks)) {
        Serial.print("Failed to connect sensor: ");
        Serial.println(sensor->name.c_str());
      } else {
        Serial.print("Successfully connected sensor: ");
        Serial.println(sensor->name.c_str());
      }
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
      float lightRaw = analogRead(A1) / 40.95;
      // float lightRaw = 
      Serial.print("Light: "); Serial.print(lightRaw); 
      Serial.print(" % ");
      Serial.println();
      if (lightRaw < 0.1) {
        // ledState = true;
        // send turn light on
      } else {
        // ledState = false;
        // send turn light off
      }
      light_sensor.sendTelementry("value", lightRaw);
      // light_sensor.sendTelementry("value", lightRaw);
      // push to coreiot

      vTaskDelay(5000);
    }
  
  }

void TaskLedLightControl(void *pvParameters){
    while(1){
        // can change the intensity of the light to be more bright
        
        float rgb_num = lightPercent / 100.0 * 255.0;
        // if (ledState) {
        //     rgb.fill(rgb.Color(rgb_num,rgb_num,rgb_num));
        //     rgb.show();
        // } else {
        //     rgb.fill(rgb.Color(0,0,0));
        //     rgb.show();
        // }
        rgb.fill(rgb.Color(rgb_num,rgb_num,rgb_num));
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

        temperature_sensor.sendTelementry("value", temperature);
        humidity_sensor.sendTelementry("value", humidity);

        // tb.sendTelemetryData("temperature", temperature);
        // tb.sendTelemetryData("humidity", humidity);
      }
    
    vTaskDelay(2000);
  }

}

void TaskMoistSensor(void *pvParameters){
    while(1){
      float Moist = analogRead(A2) / 40.95;
      Serial.print("Moist: "); Serial.print(Moist); 
      Serial.print(" % ");
      Serial.println();
      moisture_sensor.sendTelementry("value", Moist);
      // push to coreiot

      vTaskDelay(5000);
    }
  
  }

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  // Serial.print(" hello ");
  // xTaskCreate(TaskLEDControl, "LED Control", 2048, NULL, 2, NULL);
  xTaskCreate(TaskLedLightControl, "Led light", 2048, NULL, 2, NULL);
  xTaskCreate(TaskTemperature_Humidity, "Temp Hum Sensor", 2048, NULL, 2, NULL);
  xTaskCreate(TaskLightSensor, "Light Sensor", 2048, NULL, 2, NULL);
  xTaskCreate(TaskMoistSensor, "Moist Sensor", 2048, NULL, 2, NULL);
  xTaskCreate(taskWifiControl, "Wifi Control", 4096, NULL, 2, NULL);
  // xTaskCreate(taskCoreIoTConnect, "Core IoT Connect", 4096, NULL, 2, NULL);
  // Create separate connection tasks for each sensor
  xTaskCreate(taskCoreIoTConnect, "Temp Connect", 4096, &temperature_sensor, 2, NULL);
  xTaskCreate(taskCoreIoTConnect, "Humid Connect", 4096, &humidity_sensor, 2, NULL);
  xTaskCreate(taskCoreIoTConnect, "Light Connect", 4096, &light_sensor, 2, NULL);
  xTaskCreate(taskCoreIoTConnect, "Moist Connect", 4096, &moisture_sensor, 2, NULL);
  xTaskCreate(taskCoreIoTConnect, "Moist Connect", 4096, &led_light, 2, NULL);
  xTaskCreate(taskThingsBoard, "ThingsBoard", 4096, NULL, 2, NULL);
}

void loop() {
  
}