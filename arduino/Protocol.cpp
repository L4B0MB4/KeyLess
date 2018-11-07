#include "Arduino.h"
#include "Protocol.h"

    void Protocol::SendAlive()
    {
      if(this->isAlive==false)
      {
        Serial.println("u alive ?");
        delay(1000);
      }
    }

    void Protocol::CheckAlive()
    {
      String test;
      if(Serial.available()>0)
      {
        test = Serial.readStringUntil(10);
        if(test.equals("im alive"))
        {
          this->isAlive = true;
          Serial.println("alive: " + test);
          Serial.println("you can now communicate");
        }else
        {
        Serial.println("test: " + test);
        }
      }
    }
