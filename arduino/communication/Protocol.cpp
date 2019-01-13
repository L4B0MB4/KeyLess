#include "Arduino.h"
#include "Protocol.h"

void Protocol::Send(String s)
{
  Serial.println(s);
}

void Protocol::Read()
{
  String readString = Serial.readStringUntil(10);
  this->readString = readString;
}

void Protocol::SendAlive()
{
  if (millis() - this->lastAliveMessage >= this->diffBetweenAliveMessages || (this->isAlive == false && millis() - this->lastAliveMessage >= this->diffBetweenAliveMessages / 100))
  {
    if (this->hasSentAliveYet == false)
    {
      this->isAlive = false;
    }
    this->Send("CHECK-ALIVE");
    this->lastAliveMessage = millis();
    this->hasSentAliveYet = false;
  }
}

void Protocol::HandleRead()
{
  if (Serial.available() > 0)
  {
    this->Read();
    if (this->isAlive == true)
    {
      if (this->readString.equals("turn led on"))
      {
        this->TurnLedOn();
      }
      else if (this->readString.equals("turn led off"))
      {
        this->TurnLedOff();
      }
      else if (this->hasSentAliveYet = false && this->readString.equals("VERIFY-ALIVE"))
      {
        this->hasSentAliveYet = true;
        this->Send("VERIFIED-COMMUNICATION");
      }
    }
    else
    {
      if (this->readString.equals("VERIFY-ALIVE"))
      {
        this->isAlive = true;
        this->hasSentAliveYet = true;
        this->Send("VERIFIED-COMMUNICATION");
      }
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