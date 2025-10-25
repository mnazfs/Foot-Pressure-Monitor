#include <WiFi.h>

// ---------------------- WiFi Credentials ----------------------
const char* ssid = "Naseef's Phone";       // Replace with your WiFi network name
const char* password = "shamballa";        // Replace with your WiFi password

// ---------------------- Static IP Configuration ---------------
IPAddress local_IP(192, 168, 43, 150);     // 🔹Choose an unused IP on your network
IPAddress gateway(192, 168, 43, 1);        // 🔹Usually your router IP
IPAddress subnet(255, 255, 255, 0);        // 🔹Standard subnet mask
IPAddress primaryDNS(8, 8, 8, 8);          // Optional: Google DNS
IPAddress secondaryDNS(8, 8, 4, 4);        // Optional: Google DNS

// ---------------------- Web Server Setup ----------------------
WiFiServer server(80);

// ---------------------- Sensor Config -------------------------
const int sensorPins[5] = {33, 36, 34, 35, 32};  // Analog pins
float sensorPercent[5];                          // Scaled readings (0–100%)
const int LED_PIN = 2;                           // Onboard LED

// ---------------------- Function: Connect WiFi ----------------
void connectToWiFi() {
  Serial.print("Connecting to WiFi...");

  // 🔹Apply the static IP configuration before connecting
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("⚠️ Failed to configure Static IP");
  }

  WiFi.begin(ssid, password);
  unsigned long startAttemptTime = millis();

  // Wait until connected or timeout after 15 seconds
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 15000) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, LOW);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH); // LED ON when connected
  } else {
    Serial.println("\n⚠️ WiFi connection failed. Retrying...");
  }
}

// ---------------------- Setup ----------------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  connectToWiFi();
  server.begin();
  Serial.println("🌐 Web server started on port 80");
}

// ---------------------- Loop ----------------------
void loop() {
  // Check WiFi connection; reconnect if lost
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi disconnected! Attempting reconnection...");
    digitalWrite(LED_PIN, LOW);
    connectToWiFi();
  }

  WiFiClient client = server.available();
  if (!client) return;

  String currentLine = "";
  bool requestEnded = false;

  // Wait for client request
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

  // Read and scale sensor values to 0–100%
  for (int i = 0; i < 5; i++) {
    int raw = analogRead(sensorPins[i]);
    sensorPercent[i] = (raw / 4095.0) * 100.0; // scale 0–100%
  }

  // Send HTTP response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  client.println("Access-Control-Allow-Origin: *");
  client.println("Connection: close");
  client.println();

  // Construct JSON response
  client.print("{");
  for (int i = 0; i < 5; i++) {
    client.print("\"sensor");
    client.print(i + 1);
    client.print("\": ");
    client.print(sensorPercent[i], 1); // one decimal place
    if (i < 4) client.print(", ");
  }
  client.println("}");

  delay(1);
  client.stop();
}
