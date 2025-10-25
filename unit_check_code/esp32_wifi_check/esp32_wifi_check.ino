#include <WiFi.h>

// Replace with your network credentials
const char* ssid = "vivo Y28 5G";
const char* password = "anounasnasnadnis";

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.print("Connecting to WiFi network: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  int max_attempts = 20; // Wait for up to 20 attempts
  int attempt_count = 0;

  while (WiFi.status() != WL_CONNECTED && attempt_count < max_attempts) {
    delay(1000);
    Serial.print(".");
    attempt_count++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("Failed to connect to WiFi.");
  }
}

void loop() {
  // Check WiFi status periodically
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Trying to reconnect...");
    WiFi.reconnect();
  } else {
    Serial.println("WiFi still connected.");
  }
  delay(5000);
}
