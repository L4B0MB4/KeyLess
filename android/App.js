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

      DeviceEventEmitter.addListener('beaconDidAppear', ({ beacon, region }) => {
        console.log("beaconDidAppear", beacon, region);
        this.setState({
          beacon_list: this.state.beacon_list.concat(beacon)
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
