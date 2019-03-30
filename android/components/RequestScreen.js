import React, { Component } from "react";
import { TouchableOpacity, Text, View, Button, Picker, StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";
import { Actions } from "react-native-router-flux";
const IP = "192.168.0.102:8080";

export default class RequestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { requests: [] };
  }

  auth = DeviceInfo.getUniqueID();
  interValSet = false;

  goTo = route => {
    Actions[route]();
  };

  openDoorOwner = async () => {
    try {
      let response = await fetch("http://" + IP + "/azure/owner?auth=" + this.auth, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          command: "open-door",
          for: "beacon-adress-placeholder"
        })
      });
      let responseJson = await response.json();
      console.log(responseJson);
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  getRequests = async () => {
    try {
      let response = await fetch("http://" + IP + "/azure/owner?auth=" + this.auth);
      let requests = await response.json();
      console.log(requests);
      if (requests.success == true || requests.success === false) {
        return this.setState({ requests: null });
      }
      if (!Array.isArray(requests)) {
        requests = [requests];
      }
      this.setState({ requests });
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  componentDidMount = () => {
    if (this.interValSet === false) {
      this.interValSet = true;
      this.getRequests();
      setInterval(this.getRequests, 1000);
    }
  };

  render() {
    const { requests } = this.state;
    return (
      <View style={styles.maincontainer}>
        <View style={styles.element}>
          {requests
            ? requests.map(item => (
                <React.Fragment key={JSON.stringify(item)}>
                  <Button onPress={this.openDoorOwner} title={new Date(item.db_timestamp).toLocaleTimeString() + " Uhr. Öffne deinem Besucher die Tür"} />
                  <Button title="Play" onPress={this.audio} />
                </React.Fragment>
              ))
            : null}
          </View>
          <View style={styles.menu}>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("home")}>
              <Text style={styles.text}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("beacons")}>
              <Text style={styles.text}>Beacons</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("audio")}>
              <Text style={styles.text}>Audio</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menueleactive}>
            <TouchableOpacity onPress={() => this.goTo("requests")}>
              <Text style={styles.text}>Requests</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  audio = () => {
    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    var sampleSound = new Sound("", "http://192.168.0.102:8080/azure/visitor/" + auth, error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      // loaded successfully
      console.log("duration in seconds: " + sampleSound.getDuration() + "number of channels: " + sampleSound.getNumberOfChannels());
      // Play the sound with an onEnd callback
      sampleSound.setVolume(4);
      sampleSound.play((success, err) => {
        if (success) {
          console.log("successfully finished playing");
          sampleSound.release();
          this.setState({ isPlaying: false });
        } else {
          console.log("playback failed due to audio decoding errors");
          console.log(err);
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          sampleSound.reset();
        }
      });
    });

    this.setState({ isPlaying: true });
    sampleSound.play(() => {
      // Release the audio player resource
    });
  };
}


const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    justifyContent: 'center',
    flexDirection: 'column',
  },
  element: {
    margin: 20,
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  menuele: {
    backgroundColor: '#CAE1FF',
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    width: '25%',
    height: '11.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menueleactive: {
    backgroundColor: '#1E90FF',
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    width: '25%',
    height: '11.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 25,
    margin: 20
  },
  text: {
    fontSize: 20,
  }
});

