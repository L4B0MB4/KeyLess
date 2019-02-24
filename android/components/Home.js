import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import { startBeaconScanning } from "./Beacon";
import DeviceInfo from "react-native-device-info";
import Sound from "react-native-sound";
import BackgroundTask from "react-native-background-task";
const IP = "192.168.0.102:8080";
let OPENDOORONBEACON = true;

BackgroundTask.define(() => {
  console.log("Hello from a background task");
  if (OPENDOORONBEACON) startBeaconScanning(onBeaconScan, null, onBeaconScan);
  BackgroundTask.finish();
});

const onBeaconScan = async beacon => {
  try {
    let response = await fetch("http://" + IP + "/azure/owner?auth=" + DeviceInfo.getUniqueID(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        command: "open-door",
        for: beacon.address
      })
    });
    let responseJson = await response.json();
    console.log(responseJson);
  } catch (ex) {
    console.log("ERROR: " + ex);
  }
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { requests: [] };
    startBeaconScanning(onBeaconScan, null, onBeaconScan);
  }
  auth = DeviceInfo.getUniqueID();
  interValSet = false;

  newPhone = async () => {
    try {
      let response = await fetch("http://" + IP + "/azure/device", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request: "register",
          device: "phone",
          auth: DeviceInfo.getUniqueID()
        })
      });
      let responseJson = await response.json();
      this.setState({ registered: true });
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

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
          for: "all"
        })
      });
      let responseJson = await response.json();
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  getRequests = async () => {
    try {
      let response = await fetch("http://" + IP + "/azure/owner?auth=" + this.auth);
      let requests = await response.json();
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
    BackgroundTask.schedule();
  };
  audio = () => {
    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    var sampleSound = new Sound("", "http://192.168.0.102:8080/azure/visitor/" + this.auth, error => {
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
  render() {
    const { requests } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung!</Text>
        <Text>Your ID: {DeviceInfo.getUniqueID()}. Everything should be registered to it</Text>
        {requests
          ? requests.map(item => (
              <React.Fragment key={JSON.stringify(item)}>
                <Button onPress={this.openDoorOwner} title={new Date(item.db_timestamp).toLocaleTimeString() + " Uhr. Öffne deinem Besucher die Tür"} />
                <Button title="Play" onPress={this.audio} />
              </React.Fragment>
            ))
          : null}
        <TouchableOpacity onPress={() => this.goTo("beacons")}>
          <Text>
            Go To Beacon Screen!!!
            {"\n"}
            {"\n"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.goTo("audio")}>
          <Text>
            Go To Audio Screen!!!
            {"\n"}
            {"\n"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.goTo("requests")}>
          <Text>
            Go To Requests Screen!!!{"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
          </Text>
        </TouchableOpacity>
        {this.state.registered ? null : <Button onPress={this.newPhone} title="First time using this app" />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  header: {
    fontSize: 25,
    margin: 20
  },
  text: {
    fontSize: 20,
    margin: 10
  }
});
