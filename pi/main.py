import time
import io
import serial
from Protocol import protocolInstance
from server import startServer
import threading


def readInput():
    print("hiiier")
    while True:
        protocol.handleRead()


ser = serial.Serial("/dev/ttyAMA0", 9600)
protocol = protocolInstance
protocol.setSerial(ser)
thread = threading.Thread(target=readInput)
thread.start()
startServer()
