// Define analog input pin
const int sensorPin = 32;

// Variable to store readings
int sensorValue;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("ESP32 Piezo Sensor Reading...");
}

void loop() {
  sensorValue = analogRead(sensorPin);

  Serial.print("Sensor value :"); Serial.println(sensorValue);

  delay(500);  // Adjust as needed for response speed
}
