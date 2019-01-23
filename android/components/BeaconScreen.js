import React, { Component } from "react";
import { Text, View, StyleSheet, Picker } from "react-native";
import { startBeaconScanning } from "./Beacon";

export default class Beacon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beacon_list: [],
      selected_beacon: ""
    };

    startBeaconScanning(this.eddystoneAppeared, this.eddystoneDisappeared, this.beaconAppeared, this.beaconDisappeared);
  }

  eddystoneAppeared = eddystone => {
    this.setState({
      beacon_list: this.state.beacon_list.concat(eddystone)
    });
  };

  eddystoneDisappeared = eddystone => {
    const index = this.state.beacon_list.findIndex(list_beacon => this._isIdenticalEddystone(eddystone, list_beacon));
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
  };

  beaconAppeared = beacon => {
    this.setState({
      beacon_list: this.state.beacon_list.concat(beacon)
    });
  };

  beaconDisappeared = beacon => {
    const index = this.state.beacon_list.findIndex(list_beacon => this._isIdenticalBeacon(beacon, list_beacon));
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
  };

  _isIdenticalBeacon = (b1, b2) => b1.identifier === b2.identifier && b1.uuid === b2.uuid && b1.major === b2.major && b1.minor === b2.minor;

  _isIdenticalEddystone = (b1, b2) => b1.identifier === b2.identifier && b1.name === b2.name && b1.namespace === b2.namespace && b1.instanceId === b2.instanceId;

  _renderBeacons = () => {
    return (
      <View>
        <Picker onValueChange={itemValue => this.setState({ selected_beacon: itemValue })}>
          {this.state.beacon_list.map(
            (beacon, ind) => (
              <Picker.Item label={beacon.name} value={beacon.name} />
            ),
            this
          )}
        </Picker>
        <Text>Ausgewählter Beacon: {this.state.selected_beacon}</Text>
      </View>
    );
  };

  _renderEmpty = () => {
    const { beacon_list } = this.state;
    let text;
    if (!beacon_list.length) text = "Keine Beacons in der Nähe";
    return (
      <View>
        <Text>{text}</Text>
      </View>
    );
  };

  render() {
    const { beacon_list } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung</Text>
        {beacon_list.length ? this._renderBeacons() : this._renderEmpty()}
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
