import io

class Protocol:
    isAlive = 0
    serialIO = None
    lastRead = None
    lastReadString=""
    def __init__(self,serialIO: io.TextIOWrapper):
        self.serialIO = serialIO
        
    def sendAlive(self):
        self.serialIO.write(str("I am alive"))
        self.serialIO.flush() 

    def read(self):
        self.lastRead = self.serialIO.readline()
        self.lastReadString =str(self.lastRead,'utf-8').replace('\r', '')
        
        if self.lastReadString == str("u alive ?\n"):
            self.sendAlive()
            self.isAlive=1
        