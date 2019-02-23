import time
import json
import requests

# getID

auth = 'fbb07eb472819449'


def getAllOrders():
    try:
        r = requests.get("http://192.168.0.102:8080/azure/visitor?auth="+auth)
        answer = r.json()
        if answer["command"] is not None:
            payload = {'request': 'delete'}
            headers = {'content-type': 'application/json'}
            r = requests.post("http://192.168.0.102:8080/azure/visitor?auth="+auth,
                              data=json.dumps(payload), headers=headers)
            print(r.json())
            return True
        else:
            return False
    except:
        return False


while True:
    if getAllOrders() is True:
        # openDoor
        print("Open Door")
    time.sleep(1)
