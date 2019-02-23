import Audioplayer
import json
import requests

'''
def readInput():
    while True:
        protocol.handleRead()


ser = serial.Serial("/dev/ttyAMA0", 9600)
protocol = protocolInstance
protocol.setSerial(ser)
thread = threading.Thread(target=readInput)
thread.start()
startServer()

'''

auth = 'fbb07eb472819449'
device = 'ab5718aa-80af-4d77-a640-e3a5a5eb7c27'


def registerDevice():
    payload = {'request': 'register',
               'device': 'bell', 'auth': auth}
    headers = {'content-type': 'application/json'}
    r = requests.post("http://192.168.0.102:8080/azure/device",
                      data=json.dumps(payload), headers=headers)
    print(r.json())


def callOpenDoor():
    payload = {'request': 'open-door', 'device': 'bell'}
    headers = {'content-type': 'application/json'}
    r = requests.post("http://192.168.0.102:8080/azure/visitor?auth="+auth,
                      data=json.dumps(payload), headers=headers)
    print(r.json())
    files = {'beep': open('beep.wav', 'rb')}
    r = requests.post(
        "http://192.168.0.102:8080/azure/visitor/file?auth="+auth, files=files)
    print(r.text)


while True:
    t = input("Klingeln ?")
    Audioplayer.beep()
# record
    callOpenDoor()
