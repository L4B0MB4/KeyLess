import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import { startBeaconScanning } from "./Beacon";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: "",
      url: "https://keyless.azurewebsites.net/azure"
    };

    this.fetchThis();
  }

  fetchThis() {
    try {
      const response = fetch(this.state.url);
      console.log("website izz daaa");
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  openDoorVisitor() {
      try {
      fetch(this.state.url + '/visitor', {  
        method: 'POST',
        body: JSON.stringify({
          opendoor: 'true',
          person: 'visitor',
        })
      })
    } catch(ex){
      console.log("ERROR: " + ex);
    }
  }

  openDoorOwner() {
      try {
      fetch(this.state.url + '/owner', {  
        method: 'POST',
        body: JSON.stringify({
          opendoor: 'true',
          person: 'owner',
          beacon: 'doorBeacon'
        })
      })
    } catch(ex){
      console.log("ERROR: " + ex);
    }
  }

  goToBeaconScreen = () => {
    Actions.beacons();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung</Text>
        <Button onPress={this.openDoorVisitor} title="Öffne deinem Besucher die Tür" />
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
