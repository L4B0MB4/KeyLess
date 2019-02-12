import socket

 
def Main():
    
        mySocket = findServer()
        mySocket.settimeout(2)
        print("hier!!")
        message = input(" -> ")
        while message != 'q':
                mySocket.send(message.encode())
                data = mySocket.recv(1024).decode()
                 
                print ('Received from server: ' + data)
                 
                message = input(" -> ")
                 
        mySocket.close()
 

def findServer():
    port = 15001
    host=socket.gethostbyname(socket.gethostname())
    index = findLastIndex(host,".")
    host= host[:index+1]
    while 1==1:
        for ip0 in range(0,255):
            hostAppended = host+str(ip0)
            try:
                mySocket = socket.socket()
                mySocket.settimeout(0.001)
                mySocket.connect((hostAppended,port))
                return mySocket
            except socket.timeout as e :
                print(hostAppended)
 
def findLastIndex(str, x): 
    index = -1
    for i in range(0, len(str)): 
        if str[i] == x: 
            index = i 
    return index 

if __name__ == '__main__':
    Main()