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
        self.send("I am alive")

    def send(self, value):
        value += "\n"
        checksum = 0
        for i in range(0, len(value)):
            checksum += ord(value[i])
        print((str(value)+"||CHECKSUM||" + str(checksum)))
        self.ser.write((str(value)+"||CHECKSUM||" + str(checksum)).encode())

    def read(self):
        self.lastRead = self.ser.readline()
        self.lastReadString = str(self.lastRead, 'utf-8').replace('\r', '')
        splitting = self.lastReadString.split("||CHECKSUM||")
        self.lastReadString=splitting[0]
        lastReadCheckSum = splitting[1].replace('\n', '')
        print(splitting)
        checksum = 0
        for i in range(0, len(self.lastReadString)):
            checksum += ord(self.lastReadString[i])

        if checksum == int(float(lastReadCheckSum)):
            return self.lastReadString
        else:
            return "!!!Wrong Checksum!!!"+str(checksum)

    def handleRead(self):
        readString = self.read()
        print(readString)
        if readString == str("u alive ?"):
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
