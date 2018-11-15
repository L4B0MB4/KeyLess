#include "./Protocol.h"

Protocol prot;
void setup() {
Serial.begin(9600);
}

void loop() {
  prot.SendAlive();
  prot.CheckAlive();
  tone(8, 14000, 10000);
}
