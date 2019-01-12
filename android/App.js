import React, { Component } from "react";
import { DeviceEventEmitter } from "react-native";
import { Text, View, StyleSheet } from "react-native";
import Kontakt from "react-native-kontaktio";
import { getPermission } from "./components/Permission"
const { connect, startScanning } = Kontakt;
import { PermissionsAndroid } from "react-native";

export default class Beacon extends Component {
  
  componentDidMount() {
    const granted = getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, "Location");
    if (!granted){
       console.log("kein permission");
    } else{
      connect(
        undefined,
        ["EDDYSTONE", "IBEACON"]
      )
        .then(() => startScanning())
        .catch(error => console.log('error', error));
  
      
      DeviceEventEmitter.addListener(
        'eddystonesDidUpdate',
        ({ eddystones, namespace }) => {
          console.log('eddystonesDidUpdate', eddystones, namespace);
        },
      );
      
      DeviceEventEmitter.addListener(
        'beaconsDidUpdate',
        ({ beacons, region }) => {
          console.log('beaconsDidUpdate', beacons, region);
        },
      );
    }
  }
 
  render() {
    return <View />;
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
