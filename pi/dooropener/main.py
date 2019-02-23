import time
import json
import requests

# getID

auth = '811D626D-6D25-464C-9501-57592983F0B8'


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
