from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "I bims ein Flask Server!"

    
@app.route("/led/on")
def on():
    return "An"
    
@app.route("/led/off")
def off():
    return "Aus"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)