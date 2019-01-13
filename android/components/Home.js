import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { startBeaconScanning } from "./Beacon";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: "",
      url: "192.168.0.107:8080"
    };
  }

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
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung</Text>
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
