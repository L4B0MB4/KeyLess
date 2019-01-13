import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { DeviceEventEmitter } from "react-native";
import Kontakt from "react-native-kontaktio";
const { connect, startScanning } = Kontakt;
import { PermissionsAndroid } from "react-native";
import { getPermission } from "./components/Permission";

export default class Beacon extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      beacon_list: []
    };
  }

  componentDidMount(){

    connect(
      undefined,
      ["EDDYSTONE", "IBEACON"]
    )
      .then(() => startScanning())
      .catch(error => console.log('error', error));

    const granted = getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, "Location");
    if (!granted){
       console.log("error");
    } else{

      DeviceEventEmitter.addListener('eddystoneDidAppear', ({ eddystone, namespace }) => {
        console.log("eddystoneDidAppear", eddystone, namespace);
        this.setState({
          beacon_list: this.state.beacon_list.concat(eddystone)
        });
      });

      DeviceEventEmitter.addListener('eddystoneDidDisappear', ({ eddystone, namespace }) => {
        console.log("eddystoneDidDisappear", eddystone, namespace);
        const index = this.state.beacon_list.findIndex(list_beacon =>
          this._isIdenticalEddystone(eddystone, list_beacon)
        );
        this.setState({
          beacon_list: this.state.beacon_list.reduce((result, val, ind) => {
            // don't add disappeared beacon to array
            if (ind === index) return result;
            // add all other beacons to array
            else {
              result.push(val);
              return result;
            }
          }, [])
        });
      });

      DeviceEventEmitter.addListener('beaconDidAppear', ({ beacon, region }) => {
        console.log("beaconDidAppear", beacon, region);
        this.setState({
          beacon_list: this.state.beacon_list.concat(beacon)
        });
      });

      DeviceEventEmitter.addListener('beaconDidDisappear', ({ beacon, region }) => {
        console.log("beaconDidDisappear", beacon, region);
        const index = this.state.beacon_list.findIndex(list_beacon =>
          this._isIdenticalBeacon(beacon, list_beacon)
        );
        this.setState({
          beacon_list: this.state.beacon_list.reduce((result, val, ind) => {
            // don't add disappeared beacon to array
            if (ind === index) return result;
            // add all other beacons to array
            else {
              result.push(val);
              return result;
            }
          }, [])
        });
      });

    }
  }

  fetchThis = async route => {
    try {
      const response = await fetch("http://" + this.state.url + route);
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };


  _isIdenticalBeacon = (b1, b2) => (
    (b1.identifier === b2.identifier) &&
    (b1.uuid === b2.uuid) &&
    (b1.major === b2.major) &&
    (b1.minor === b2.minor)
  );

  _isIdenticalEddystone = (b1, b2) => (
    (b1.identifier === b2.identifier) &&
    (b1.name === b2.name) &&
    (b1.namespace === b2.namespace) &&
    (b1.instanceId === b2.instanceId)
  );

  _renderBeacons = () => {
    return this.state.beacon_list.map((beacon, ind) => (
      <View key={ind}>
        <Text>{beacon.name}</Text>
        <Text>Distance: {beacon.accuracy}</Text>
        <Text>Proximity: {beacon.proximity}</Text>  
        <Text>{"\n "}</Text>      
      </View>
    ), this);
  };

  _renderEmpty = () => {
    const { beacon_list } = this.state;
    let text;
    if (!beacon_list.length) text = "Keine Beacons in der Nähe";
    return (
      <View>
        <Text >{text}</Text>
      </View>
    );
  };

  render() {
    const { beacon_list } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung</Text>
        {beacon_list.length ? this._renderBeacons() : this._renderEmpty()}
        <Text>{"\n Hot reload"}</Text>
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
