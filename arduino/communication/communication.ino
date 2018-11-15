#include "./Protocol.h"

Protocol prot;
void setup() {
Serial.begin(9600);
}

void loop() {
  prot.SendAlive();
  prot.CheckAlive();
  tone(8, 3000, 1000);
  delay(1000);
}
