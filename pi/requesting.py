import requests
import json
from collections import namedtuple
requestUrl = "https://keyless.azurewebsites.net/azure/visitor"


def _json_object_hook(d): return namedtuple('X', d.keys())(*d.values())


def json2obj(data): return json.loads(data, object_hook=_json_object_hook)


def makeRequest(requestUrl):
    response = requests.get(requestUrl)
    jsonResponse = json.loads(response.content)
    if hasattr(jsonResponse, "success"):
        print(jsonResponse.success)
    else:
        print(jsonResponse)


makeRequest(requestUrl)
