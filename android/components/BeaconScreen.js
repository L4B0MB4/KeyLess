import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Picker, Button } from "react-native";
import { startBeaconScanning } from "./Beacon";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";
const IP = "192.168.0.102:8080";

export default class Beacon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beacon_list: [],
      selected_beacon: ""
    };

    startBeaconScanning(this.eddystoneAppeared, this.eddystoneDisappeared, this.beaconAppeared, this.beaconDisappeared);
  }

  goTo = route => {
    Actions[route]();
  };

  openDoorOwner() {
    try {
      fetch("http://" + IP + "/azure/owner?auth=" + DeviceInfo.getUniqueID(), {
        method: "POST",
        body: JSON.stringify({
          request: "open-door",
          sender: "beacon",
          beacon: "beacon-adress"
        })
      });
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
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

  registerBeacon = async address => {
    try {
      const res = await fetch("http://" + IP + "/azure/device", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request: "register",
          device: "beacon",
          beacon: address,
          auth: DeviceInfo.getUniqueID()
        })
      });
      const resjson = await res.json();
      if (resjson.success === true) {
        this.setState({ registeredDevice: true });
      }
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  _isIdenticalBeacon = (b1, b2) => b1.identifier === b2.identifier && b1.uuid === b2.uuid && b1.major === b2.major && b1.minor === b2.minor;

  _isIdenticalEddystone = (b1, b2) => b1.identifier === b2.identifier && b1.name === b2.name && b1.namespace === b2.namespace && b1.instanceId === b2.instanceId;

  _renderBeacons = () => {
    return (
      <View>
        <Picker onValueChange={itemValue => this.setState({ selected_beacon: itemValue })} selectedValue={this.state.selected_beacon}>
          {this.state.beacon_list.map(
            (beacon, ind) => (
              <Picker.Item label={beacon.name || "No name"} key={beacon.address} value={beacon.address} />
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
    const { beacon_list, registeredDevice, selected_beacon } = this.state;
    return (
      <View style={styles.maincontainer}>
        <View style={styles.element}>
          {beacon_list.length ? this._renderBeacons() : this._renderEmpty()}
          {selected_beacon ? <Button title="Register" onPress={() => this.registerBeacon(selected_beacon)} /> : null}
          {registeredDevice ? <Text>You registered your Beacon</Text> : null}
        </View>
        <View style={styles.menu}>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("home")}>
              <Text style={styles.text}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menueleactive}>
            <TouchableOpacity onPress={() => this.goTo("beacons")}>
              <Text style={styles.text}>Beacons</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("audio")}>
              <Text style={styles.text}>Audio</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("requests")}>
              <Text style={styles.text}>Requests</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    justifyContent: 'center',
    flexDirection: 'column',
  },
  element: {
    margin: 20,
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  menuele: {
    backgroundColor: '#CAE1FF',
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    width: '25%',
    height: '11.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menueleactive: {
    backgroundColor: '#1E90FF',
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    width: '25%',
    height: '11.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 25,
    margin: 20
  },
  text: {
    fontSize: 20,
  }
});

