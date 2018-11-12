import io

class Protocol:
    isAlive = 0
    ser = None
    lastRead = None
    lastReadString=""
    def __init__(self,ser):
        self.ser = ser
        
    def sendAlive(self):
        self.ser.write(str("I am alive").encode())

    def read(self):
        self.lastRead = self.ser.readline()
        self.lastReadString =str(self.lastRead,'utf-8').replace('\r', '')
        lastReadCheckSum = self.ser.readline()
        lastReadCheckSum =str(lastReadCheckSum,'utf-8').replace('\r', '')
        checksum =0
        for x in range(0,len(self.lastReadString))  
            checksum += s[i]
        if checksum == int(float(lastReadCheckSum))
            return self.lastReadString
        else:
            return "!!!Wrong Checksum!!!


    def handleRead(self):
        readString = read()
        print(readString)
        if readString == str("u alive ?\n"):
            self.sendAlive()
            self.isAlive=1
        