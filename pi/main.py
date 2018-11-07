import time
import io
import serial
import Protocol

ser = serial.Serial("/dev/ttyAMA0",9600)
sio = io.TextIOWrapper(io.BufferedRWPair(ser, ser))
protocol = Protocol.Protocol(sio,ser)
while True:
    #sio.write(str("hello\n"))
    #sio.flush()  
    #time.sleep(1)
    if not protocol.isAlive:
        print("read")
        protocol.read()
    else:
        break