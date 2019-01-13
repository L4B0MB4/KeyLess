import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { startBeaconScanning } from "./Beacon";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beaconName: "",
      beaconAddress: "",
      beaconNamespace: "",
      buttonPressed: "",
      url: "192.168.0.107:8080"
    };
    startBeaconScanning(this.beaconAppeared, this.beaconDisappeared);
  }

  beaconAppeared = eddystone => {
    this.setState({
      beaconName: eddystone.name,
      beaconAddress: eddystone.address,
      beaconNamespace: eddystone.namespace
    });
  };

  beaconDisappeared = eddystone => {
    this.setState({
      beaconName: "",
      beaconAddress: "",
      beaconNamespace: ""
    });
  };

  fetchThis = async route => {
    try {
      const response = await fetch("http://" + this.state.url + route);
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };
  goToBeaconScreen = () => {
    Actions.beacons();
  };

  render() {
    const { beaconAddress, beaconName, beaconNamespace, buttonPressed } = this.state;
    if (beaconAddress == "C4:E7:AA:00:E5:7D" && beaconNamespace == "646f6f72426561636f6e") {
      text = <Text>Dein Beacon "{beaconName}" ist in der Nähe. Die Tür wird jetzt geöffnet.</Text>;
    } else {
      text = <Text>Dein Beacon wurde nicht in der Nähe erkannt.</Text>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung</Text>
        <Text style={styles.text}>{text}</Text>
        <TouchableOpacity style={{ margin: 128 }} onPress={this.goToBeaconScreen}>
          <Text>Go To Beacon Screen</Text>
        </TouchableOpacity>
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
