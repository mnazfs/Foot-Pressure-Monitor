#include <WiFi.h>

// ---------------------- WiFi Credentials ----------------------
const char* ssid = "Naseef's Phone";       // Replace with your WiFi network name
const char* password = "shamballa";        // Replace with your WiFi password

// ---------------------- Static IP Configuration ---------------
IPAddress local_IP(10, 11, 129, 150);      // 🔹 Choose an unused IP in your subnet
IPAddress gateway(10, 11, 129, 1);         // 🔹 Usually router IP
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

// ---------------------- Web Server Setup ----------------------
WiFiServer server(80);

// ---------------------- Sensor Config -------------------------
const int sensorPins[5] = {33, 36, 34, 35, 32};  // Analog pins
float sensorPercent[5];                          // Scaled readings (0–100%)

// ---------------------- LED Pins ------------------------------
const int LED_WIFI = 4;    // External LED for Wi-Fi status
const int LED_ONBOARD = 2; // Optional onboard LED

// ---------------------- Function: Connect WiFi ----------------
void connectToWiFi() {
  Serial.print("Connecting to WiFi...");

  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("⚠️ Failed to configure Static IP");
  }

  WiFi.begin(ssid, password);
  unsigned long startAttemptTime = millis();

  // Blink LED while connecting
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 15000) {
    digitalWrite(LED_WIFI, HIGH);
    delay(300);
    digitalWrite(LED_WIFI, LOW);
    delay(300);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_WIFI, HIGH);  // LED stays ON when connected
    digitalWrite(LED_ONBOARD, HIGH);
  } else {
    Serial.println("\n⚠️ WiFi connection failed. Retrying soon...");
    digitalWrite(LED_WIFI, LOW);
  }
}

// ---------------------- Setup ----------------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_ONBOARD, OUTPUT);
  digitalWrite(LED_WIFI, LOW);
  digitalWrite(LED_ONBOARD, LOW);

  connectToWiFi();
  server.begin();
  Serial.println("🌐 Web server started on port 80");
}

// ---------------------- Loop ----------------------
void loop() {
  // Reconnect if WiFi lost
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi disconnected! Attempting reconnection...");
    digitalWrite(LED_WIFI, LOW);
    connectToWiFi();
  }

  WiFiClient client = server.available();
  if (!client) return;

  String currentLine = "";
  bool requestEnded = false;

  while (client.connected() && !requestEnded) {
    if (client.available()) {
      char c = client.read();
      if (c == '\n' && currentLine.length() == 0) {
        requestEnded = true;
      } else if (c == '\n') {
        currentLine = "";
      } else if (c != '\r') {
        currentLine += c;
      }
    }
  }

  // Read sensors and scale 0–100%
  for (int i = 0; i < 5; i++) {
    int raw = analogRead(sensorPins[i]);
    sensorPercent[i] = (raw / 4095.0) * 100.0;
  }

  // Send JSON response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  client.println("Access-Control-Allow-Origin: *");
  client.println("Connection: close");
  client.println();

  client.print("{");
  for (int i = 0; i < 5; i++) {
    client.print("\"sensor");
    client.print(i + 1);
    client.print("\": ");
    client.print(sensorPercent[i], 1);
    if (i < 4) client.print(", ");
  }
  client.println("}");

  delay(1);
  client.stop();
}
