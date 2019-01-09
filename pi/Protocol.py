import io


class Protocol:
    isAlive = 0
    ser = None
    lastRead = None
    lastReadString = ""
    buttonPressedTimes = 0
    led = 0

    def setSerial(self, ser):
        self.ser = ser

    def sendAlive(self):
        self.send("VERIFY-ALIVE")

    def send(self, value):
        self.ser.write((str(value)).encode())

    def read(self):
        try:
            self.lastRead = self.ser.readline()
            self.lastReadString = str(
                self.lastRead, 'utf-8').replace('\r', '').replace("\n", "")
            return self.lastReadString
        except:
            try:
                print("couldnt transform into utf8: "+str(self.lastRead))
            except:
                print("couldnt handle string")
            return ""

    def handleRead(self):
        readString = self.read()
        print(readString)
        if readString == str("CHECK-ALIVE"):
            self.sendAlive()
            self.isAlive = 1
        elif readString == str("button was pressed"):
            self.buttonPressedTimes = self.buttonPressedTimes + 1
        elif readString == str("led is on"):
            self.led = 1
        elif readString == str("led is off"):
            self.led = 0

    def getButtonPressedTimes(self):
        return self.buttonPressedTimes


protocolInstance = Protocol()
