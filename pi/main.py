import time
import io
import serial
from Protocol import protocolInstance
from server import startServer
import threading
ThreadRunning = 0


def readInput():
    ThreadRunning = 1
    while True:
        protocol.handleRead()


ser = serial.Serial("/dev/ttyAMA0", 9600)
protocol = protocolInstance
protocol.setSerial(ser)
if ThreadRunning == 0:
    thread = threading.Thread(target=readInput)
    thread.start()
startServer()
