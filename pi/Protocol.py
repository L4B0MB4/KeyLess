import io

class Protocol:
    isAlive = 0
    serialIO = None
    ser = None
    lastRead = None
    lastReadString=""
    def __init__(self,serialIO,ser):
        self.serialIO = serialIO
        self.ser = ser
        
    def sendAlive(self):
        self.serialIO.write(str("I am alive"))
        self.serialIO.flush() 

    def read(self):
        print("try read")
        self.lastRead = self.ser.readline()
        print(self.lastRead)
        self.lastRead = self.serialIO.readline()
        self.lastReadString =str(self.lastRead,'utf-8').replace('\r', '')
        
        if self.lastReadString == str("u alive ?\n"):
            self.sendAlive()
            self.isAlive=1
        