from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "I bims ein Flask Server!"

@app.route("/buttonPressed/<int:number>", methods=['GET'])
def button():
    return "Button was pressed %d times" % number

@app.route("/ledOn", methods=['GET'])
def ledOn():
    return "Turning LED on"

@app.route("/ledOff", methods=['GET'])
def ledOff():
    return "Turning LED off"

if __name__ == "__main__":
    #Pi
    #app.run(host='0.0.0.0', port=80, debug=True)
    #Laptop
    app.run(host='0.0.0.0', port=8080, debug=True)