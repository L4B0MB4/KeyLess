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
        print(self.lastReadString)
        if self.lastReadString == str("u alive ?\n"):
            self.sendAlive()
            self.isAlive=1
        