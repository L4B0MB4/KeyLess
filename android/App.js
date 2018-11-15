/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow*/

import React, { Component } from "react";
import { Platform, Text, View, DeviceEventEmitter, StyleSheet, AppRegistry, Button } from "react-native";
import { PermissionsAndroid } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

import Kontakt from "react-native-kontaktio";
const { connect, startScanning } = Kontakt;
import { AudioRecorder, AudioUtils } from "react-native-audio";

export default class MinimalExample extends Component {
  constructor(props) {
    console.log(RNFetchBlob.fs.dirs);
    super(props);
    this.state = {
      beaconName: "",
      beaconAddress: "",
      beaconNamespace: "",
      audioPath: RNFetchBlob.fs.dirs.DownloadDir + "/test.acc"
    };
  }
  prepareRecordingPath = audioPath => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 10,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 1
    });
  };

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

  getPermissions = async () => {
    let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
      title: "storage write Permission",
      message: "Beacon App needs access to your location " + "so you can locate Beacons."
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the storage");
    } else {
      console.log("storage permission denied");
    }
    granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
      title: "storage read Permission",
      message: "Beacon App needs access to your location " + "so you can locate Beacons."
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the storage");
    } else {
      console.log("storage permission denied");
    }
    AudioRecorder.requestAuthorization().then(isAuthorised => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = data => {
        console.log(data);
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = data => {
        console.log(data);
      };
    });
  };

  componentDidMount() {
    this.getPermissions();

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
  }

  _record = async () => {
    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({ recording: true, paused: false });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  };
  _stop = async () => {
    this.setState({ stoppedRecording: true, recording: false, paused: false });

    try {
      const filePath = await AudioRecorder.stopRecording();
      console.log(filePath);
      return filePath;
    } catch (error) {
      console.error(error);
    }
  };
  pressRecord = () => {
    this._record();
    setTimeout(this._stop, 3000);
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
        <Button onPress={this.pressRecord} title="Record" />
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
