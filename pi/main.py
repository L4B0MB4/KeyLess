import time
import io
import serial
from Protocol import protocolInstance
from server import startServer

ser = serial.Serial("/dev/ttyAMA0", 9600)
protocol = protocolInstance
protocol.setSerial(ser)
startServer()

while True:
    # sio.write(str("hello\n"))
    # sio.flush()
    # time.sleep(1)
    if not protocol.isAlive:
        protocol.handleRead()
    else:
        break
