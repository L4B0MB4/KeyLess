/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow*/

import React, { Component } from "react";
import { Platform, Button, Text, View, DeviceEventEmitter, StyleSheet, AppRegistry } from "react-native";
import { PermissionsAndroid } from "react-native";

import Kontakt from "react-native-kontaktio";
const { connect, startScanning } = Kontakt;

export default class Beacon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beaconName: "",
      beaconAddress: "",
      beaconNamespace: ""
    };
  }

  async getPermission() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Location Permission",
        message: "Beacon App needs access to your location " + "so you can locate Beacons."
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied");
      }

      connect(
        undefined,
        ["EDDYSTONE"]
      )
        .then(() => {
          console.log("connect");
          startScanning();
        })
        .catch(error => console.log("error", error));
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount() {
    DeviceEventEmitter.addListener("eddystoneDidAppear", ({ eddystone, namespace }) => {
      console.log("eddystoneDidAppear", eddystone, namespace);
      this.setState({
        beaconName: eddystone.name,
        beaconAddress: eddystone.address,
        beaconNamespace: eddystone.namespace
      });
    });

    DeviceEventEmitter.addListener("eddystoneDidDisappear", ({ eddystone, namespace }) => {
      console.log("eddystoneDidDisappear", eddystone, namespace);
      this.setState({
        beaconName: "",
        beaconAddress: "",
        beaconNamespace: ""
      });
    });

    DeviceEventEmitter.addListener("namespaceDidEnter", ({ namespace }) => {
      console.log("namespaceDidEnter", namespace);
    });

    DeviceEventEmitter.addListener("scanStatus", status => {
      console.log("scanStatus", status);
    });
    this.getPermission()
      .then(() => console.log("permissions"))
      .catch(err => console.log(err));
    this.fetchThis();
  }

  fetchThis = async (route) => {
    try {
      const response = await fetch("http://192.168.0.109:80/"+route);
      console.log(response);
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  render() {
    const { beaconAddress, beaconName, beaconNamespace } = this.state;
    if (beaconAddress == "C4:E7:AA:00:E5:7D" && beaconNamespace == "646f6f72426561636f6e") {
      text = <Text>Dein Beacon "{beaconName}" ist in der Nähe. Die Tür wird jetzt geöffnet.</Text>;
    } else {
      text = <Text>Dein Beacon wurde nicht in der Nähe erkannt.</Text>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung</Text>
        <Text style={styles.text}>{text}</Text>
        <Button onPress={()=>this.fetchThis("led/on")} title="Led an" color="#841584" />
        <Button onPress={()=>this.fetchThis("led/off")} title="Led aus" color="#841584" />
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
