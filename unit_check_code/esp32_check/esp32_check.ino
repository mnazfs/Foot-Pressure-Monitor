// Define the GPIO pin connected to the on-board LED
const int LED_PIN = 2;  // Default onboard LED for most ESP32 boards

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);
  Serial.println("ESP32 Functionality Test Starting...");
  
  // Initialize the LED pin as an output
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  Serial.println("LED ON");
  digitalWrite(LED_PIN, HIGH); // Turn the LED on
  delay(1000);                 // Wait for 1 second

  Serial.println("LED OFF");
  digitalWrite(LED_PIN, LOW);  // Turn the LED off
  delay(1000);                 // Wait for 1 second
}
