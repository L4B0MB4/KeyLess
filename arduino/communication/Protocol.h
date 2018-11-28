/* 
    Lets you communicate with a raspberry pi
*/

#include "Arduino.h"
#ifndef Protocol_h
#define Protocol_h
class Protocol
{
  public:
    unsigned long lastAliveMessage = 0;
    int diffBetweenAliveMessages = 1000;
    bool isAlive = false;
    String readString = String();
    void SendAlive();
    void CheckAlive();
    void Send(String s);
    void Read();
    void TurnLedOff();
    void TurnLedOn();
};
#endif