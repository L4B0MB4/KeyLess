/* 
    Lets you communicate with a raspberry pi
*/

#include "Arduino.h"
#ifndef Protocol_h
#define Protocol_h
class Protocol
{
  public:
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