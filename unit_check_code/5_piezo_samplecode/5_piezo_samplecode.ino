// Define analog input pins for five sensors
const int sensorPins[5] = {32, 33, 34, 35, 36};

// Variables to store readings
int sensorValues[5];

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("ESP32 Piezo Sensor Reading...");
}

void loop() {
  // Loop through all sensors
  for (int i = 0; i < 5; i++) {
    sensorValues[i] = analogRead(sensorPins[i]);
  }

  // Print readings in organized format
  Serial.print("Sensor 1: "); Serial.print(sensorValues[0]);
  Serial.print(" | Sensor 2: "); Serial.print(sensorValues[1]);
  Serial.print(" | Sensor 3: "); Serial.print(sensorValues[2]);
  Serial.print(" | Sensor 4: "); Serial.print(sensorValues[3]);
  Serial.print(" | Sensor 5: "); Serial.println(sensorValues[4]);

  delay(500);  // Adjust as needed for response speed
}
