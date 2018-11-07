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
        print("try read")
        self.lastRead = self.ser.readline()
        print(self.lastRead)
        self.lastReadString =str(self.lastRead,'utf-8').replace('\r', '')
        
        if self.lastReadString == str("u alive ?\n"):
            self.sendAlive()
            self.isAlive=1
        