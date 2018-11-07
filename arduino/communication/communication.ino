#include "./Protocol.h"

Protocol prot;
void setup() {
Serial.begin(9600);
}

void loop() {
  prot.SendAlive();
  prot.CheckAlive();
}
