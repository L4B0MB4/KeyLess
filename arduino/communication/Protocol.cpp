#include "Arduino.h"
#include "Protocol.h"

void Protocol::Send(String s)
{
  int checksum = 0;
  for (int i = 0; s[i]!='\0';i++)
  {
    checksum += s[i];
  }
  checksum +=10;// linefeed
  String checksumString = String(checksum);
  Serial.println(s);
  Serial.println(checksumString);
}


void Protocol::Read()
{
  String readString = Serial.readStringUntil(10);
  String readChecksum = Serial.readStringUntil(10);
  Serial.println("just in: "+readString);
  Serial.println("with checksum:" + readChecksum);
  int checksum = 0;
  for (int i = 0; readString[i]!='\0';i++) 
  {
    checksum += readString[i];
  }
  checksum+=10;// linefeed
  String checksumString = String(checksum);
  if(checksumString.equals(readChecksum))
  {
    this->readString = readString;
  }
  else 
  {
    this->readString = "Wrong checksum " +checksumString;
  }
}

void Protocol::SendAlive()
{
  if (this->isAlive == false)
  {
    this->Send("u alive ?");
    delay(1000);
  }
}

void Protocol::CheckAlive()
{
  String test;
  if (Serial.available() > 0)
  {
    this->Read();
    if (this->readString.equals("I am alive"))
    {
      this->isAlive = true;
      this->Send("alive: " + this->readString);
      this->Send("you can now communicate");
    }
    else
    {
      this->Send("Cannot communicate: " + test);
    }
  }
}
