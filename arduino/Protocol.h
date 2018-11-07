/* 
    Lets you communicate with a raspberry pi
*/


#include "Arduino.h"
#ifndef Protocol_h
#define Protocol_h
class Protocol
{
  public:
    bool isAlive=false;
    void SendAlive();
    void CheckAlive();
};
#endif