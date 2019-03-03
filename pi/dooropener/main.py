import time
import json
import requests
import RPi.GPIO as io

# getID

auth = 'fbb07eb472819449'
beacon = 'E3:B4:7C:66:96:5B'
pin = 21


def getAllOrders():
    try:
        r = requests.get("http://192.168.0.102:8080/azure/visitor?auth="+auth)
        answers = r.json()
        for answer in answers:
            if answer["command"] is not None and (beacon == answer['for'] or answer['for'] == "all"):
                payload = {'request': 'delete'}
                headers = {'content-type': 'application/json'}
                r = requests.post("http://192.168.0.102:8080/azure/visitor?auth="+auth,
                                  data=json.dumps(payload), headers=headers)
                print(r.json())
                return True
        return False
    except:
        return False


def openDoor():
    io.output(pin, 1)
    time.sleep(5)
    io.output(pin, 0)


io.setmode(io.BCM)
while True:
    if getAllOrders() is True:
        openDoor()
        print("Open Door")
    time.sleep(1)
