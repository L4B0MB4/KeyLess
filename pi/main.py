import time
import io
import serial
ser = serial.Serial("/dev/ttyAMA0",9600)
sio = io.TextIOWrapper(io.BufferedRWPair(ser, ser))
isAlive= 0
readString =""
while True and not isAlive:
    #sio.write(str("hello\n"))
    #sio.flush()  
    #time.sleep(1)
    response = ser.readline()
    readString = str(response,'utf-8').replace('\r', '')
    print(readString.encode())
    print(str("u alive ?\n").encode())
    if readString == str("u alive ?\n"):
        isAlive =1
    
sio.write(str("im alive"))
sio.flush() 
