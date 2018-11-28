import time
import io
import serial
from Protocol import protocolInstance
from server import startServer
import threading

protocol = protocolInstance


def readInput():
    while True:
        protocol.handleRead()


ser = serial.Serial("/dev/ttyAMA0", 9600)
protocol.setSerial(ser)
thread = threading.Thread(target=readInput)
thread.start()
startServer()
