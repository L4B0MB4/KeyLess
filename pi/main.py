import time
import io
import serial
from Protocol import protocolInstance
from server import startServer
from threading import Thread

ser = serial.Serial("/dev/ttyAMA0", 9600)
protocol = protocolInstance
protocol.setSerial(ser)
thread = Thread(target = startServer)
thread.start()
thread.join()
while True:
    if not protocol.isAlive:
        protocol.handleRead()
    else:
        break
