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
    int diffBetweenAliveMessages = 5000;
    bool isAlive = false;
    bool hasSentAliveYet = false;
    int ledOn = 0;
    String readString = String();
    void SendAlive();
    void Send(String s);
    void Read();
    void TurnLedOff();
    void TurnLedOn();
    void SendButtonPressed();
    void HandleRead();
};
#endif