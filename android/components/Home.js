import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import { startBeaconScanning } from "./Beacon";
import DeviceInfo from "react-native-device-info";
const IP = "192.168.0.102:8080";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: "",
      url: "https://keyless.azurewebsites.net/azure"
    };
  }

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
      console.log(responseJson);
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  openDoorVisitor() {
    try {
      console.log("FETCHING");
      const res = fetch("https://keyless.azurewebsites.net/azure/visitor?auth=123", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request: "open-door",
          sender: "androidID",
          beacon: "beacon-adress"
        })
      })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(err) {
          console.log("ERROR:" + err);
        });
      console.log(res);
    } catch (ex) {
      console.log("ERRORCATCH: " + ex);
    }
  }

  goTo = route => {
    Actions[route]();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung!</Text>
        <Text>Your ID: {DeviceInfo.getUniqueID()}. Everything should be registered to it</Text>
        <Button onPress={this.openDoorVisitor} title="Öffne deinem Besucher die Tür" />
        <TouchableOpacity onPress={() => this.goTo("beacons")}>
          <Text>Go To Beacon Screen!!!</Text>
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
        <Button onPress={this.newPhone} title="First time using this app" />
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
