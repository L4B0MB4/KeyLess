import time
import io
import serial
from Protocol import protocolInstance
from server import startServer
from threading


def readInput():
    while True:
        if not protocol.isAlive:
            protocol.handleRead()
        else:
            break


ser = serial.Serial("/dev/ttyAMA0", 9600)
protocol = protocolInstance
protocol.setSerial(ser)
thread = threading.Thread(target=readInput)
thread.start()
startServer()
