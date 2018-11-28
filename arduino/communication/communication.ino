#include "./Protocol.h"

int buttonPressed = 0;
int lastButtonState = 0;
int readingButtonState = 0;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

Protocol prot;
void setup()
{
  Serial.begin(9600);
}

void loop()
{
  prot.SendAlive();
  prot.CheckAlive();
  checkButtonPress();
}

void checkButtonPress()
{
  if (readingButtonState != lastButtonState)
  {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay)
  {
    if (readingButtonState != lastButtonState)
    {
      buttonPressed++;
    }
  }

  lastButtonState = readingButtonState;
  if (buttonPressed > 0)
  {
    prot.Send("button was pressed");
    buttonPressed--;
  }
}