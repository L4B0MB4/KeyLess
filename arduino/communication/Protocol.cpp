#include "Arduino.h"
#include "Protocol.h"

void Protocol::Send(String s)
{
  int checksum = 0;
  for (int i = 0; s[i] != '\0'; i++)
  {
    checksum += s[i];
  }
  checksum += 10; // linefeed
  String checksumString = String(checksum);
  Serial.println(s);
  Serial.println(checksumString);
}

void Protocol::Read()
{
  String readString = Serial.readStringUntil(10);
  String readChecksum = Serial.readStringUntil(10);
  int checksum = 0;
  for (int i = 0; readString[i] != '\0'; i++)
  {
    checksum += readString[i];
  }
  checksum += 10; // linefeed
  String checksumString = String(checksum);
  if (checksumString.equals(readChecksum))
  {
    this->readString = readString;
  }
  else
  {
    this->readString = "Wrong checksum " + checksumString;
    this->Send("expected checksum: " + checksumString + " but got instead:" + readChecksum);
  }
}

void Protocol::SendAlive()
{
  if (this->isAlive == false && millis() - this->lastAliveMessage >= this->diffBetweenAliveMessages)
  {
    this->Send("u alive ?");
    this->lastAliveMessage = millis();
  }
}

void Protocol::CheckAlive()
{
  if (Serial.available() > 0 && this->isAlive == false)
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
      this->Send("Cannot communicate: " + this->readString);
    }
  }
}

void Protocol::HandleRead()
{
  if (Serial.available() > 0 && this->isAlive == true)
  {
    this->Read();
    if (this->readString.equals("turn led on"))
    {
      this->TurnLedOn();
    }
    else if (this->readString.equals("turn led off"))
    {
      this->TurnLedOff();
    }
  }
}

void Protocol::TurnLedOn()
{
  this->ledOn = 1;
}

void Protocol::TurnLedOff()
{
  this->ledOn = 0;
}

void Protocol::SendButtonPressed()
{
  this->Send("button was pressed");
}