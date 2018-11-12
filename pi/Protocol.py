import io

class Protocol:
    isAlive = 0
    ser = None
    lastRead = None
    lastReadString=""
    def __init__(self,ser):
        self.ser = ser
        
    def sendAlive(self):
        self.send("I am alive")


    def send(self,value):
        checksum =0
        for i in range(0,len(value)):  
            checksum += ord(value[i])

        self.ser.write(str(value).encode())
        self.ser.write(str(checksum).encode())

    def read(self):
        self.lastRead = self.ser.readline()
        self.lastReadString =str(self.lastRead,'utf-8').replace('\r', '')
        lastReadCheckSum = self.ser.readline()
        lastReadCheckSum =str(lastReadCheckSum,'utf-8').replace('\r', '')
        checksum =0
        for i in range(0,len(self.lastReadString)):  
            checksum += ord(self.lastReadString[i])
        if checksum == int(float(lastReadCheckSum)):
            return self.lastReadString
        else:
            return "!!!Wrong Checksum!!!"+str(checksum)


    def handleRead(self):
        readString = self.read()
        print(readString)
        if readString == str("u alive ?\n"):
            self.sendAlive()
            self.isAlive=1
        