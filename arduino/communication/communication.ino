#include "./Protocol.h"

int buttonPressed = 0;
int lastButtonState = 0;
int readingButtonState = 0;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
int buttonPin = 7;
int ledPin = 8;

Protocol prot;
void setup()
{
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop()
{
  digitalWrite(ledPin, prot.ledOn);
  prot.SendAlive();
  prot.HandleRead();
  //checkButtonPress();
}

void checkButtonPress()
{
  readingButtonState = digitalRead(buttonPin);

  if ((millis() - lastDebounceTime) > debounceDelay)
  {
    if (readingButtonState != lastButtonState && readingButtonState == 1)
    {
      buttonPressed++;
      lastDebounceTime = millis();
    }
  }

  lastButtonState = readingButtonState;
  if (buttonPressed > 0)
  {
    prot.Send("button was pressed");
    buttonPressed--;
  }
}