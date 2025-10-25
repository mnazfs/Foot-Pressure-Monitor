#include <WiFi.h>

// WiFi credentials
const char* ssid = "vivo Y28 5G";          // Replace with your WiFi network name
const char* password = "anounasnasnadnis"; // Replace with your WiFi password

// ESP32 Web server running on port 80
WiFiServer server(80);

// Analog input pins for 5 piezo sensors
const int sensorPins[5] = {32, 33, 34, 35, 36};
int sensorValues[5];

// Onboard LED pin (commonly GPIO 2)
const int LED_PIN = 2;

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // LED off initially

  // Connect to WiFi network
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, LOW); // keep LED OFF while not connected
  }
  Serial.println(" connected");

  digitalWrite(LED_PIN, HIGH); // Turn ON LED when connected

  // Start the server
  server.begin();
  Serial.print("Server started at IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Check WiFi status continuously (optionally turn off LED if WiFi drops)
  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(LED_PIN, HIGH); // LED ON
  } else {
    digitalWrite(LED_PIN, LOW);  // LED OFF
  }

  WiFiClient client = server.available();   // Listen for incoming clients

  if (client) {
    String currentLine = "";
    bool requestEnded = false;

    // Read HTTP request
    while (client.connected() && !requestEnded) {
      if (client.available()) {
        char c = client.read();
        if (c == '\n' && currentLine.length() == 0) {
          requestEnded = true;
        }
        if (c == '\n') {
          currentLine = "";
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }

    // Read piezo sensor values
    for (int i = 0; i < 5; i++) {
      sensorValues[i] = analogRead(sensorPins[i]);
    }

    // Send HTTP response with CORS header
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/plain");
    client.println("Access-Control-Allow-Origin: *");
    client.println("Connection: close");
    client.println();

    // Format sensor data: "sensor 1: reading, sensor 2: reading, ..."
    for (int i = 0; i < 5; i++) {
      client.print("Sensor ");
      client.print(i + 1);
      client.print(": ");
      client.print(sensorValues[i]);
      if (i < 4) {
        client.print(", ");
      }
    }
    client.println();

    delay(1);
    client.stop();
  }
}
