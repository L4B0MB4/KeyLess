
from flask import Flask
from Protocol import protocolInstance
buttonPressedTimes = 0

app = Flask(__name__)


@app.route("/")
def hello():
    return "I bims ein Flask Server!"


@app.route("/buttonPressed", methods=['GET'])
def button():
    return "Button was pressed %d times" % protocolInstance.getButtonPressedTimes()


@app.route("/ledOn", methods=['GET'])
def ledOn():
    protocolInstance.send("turn led on")
    return "Turning LED on"


@app.route("/ledOff", methods=['GET'])
def ledOff():
    protocolInstance.send("turn led off")
    return "Turning LED off"


def startServer():
    print("Button pressed " +
          str(protocolInstance.getButtonPressedTimes()) + " times")
    app.run(host='0.0.0.0', port=8080, debug=True)
