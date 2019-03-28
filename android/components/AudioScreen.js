import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Button } from "react-native";
import { Actions } from "react-native-router-flux";
// Import the react-native-sound module
import Sound from "react-native-sound";

export default class AudioScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: "",
      isPlaying: false
    };
  }

  goTo = route => {
    Actions[route]();
  };

  render() {
    return (
      <View style={styles.maincontainer}>
        <View style={styles.element}>
          <Button title="Play" onPress={this.audio} />
          {this.state.isPlaying ? <Text>Playing</Text> : null}
        </View>
        <View style={styles.menu}>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("home")}>
              <Text style={styles.text}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuele}>
            <TouchableOpacity onPress={() => this.goTo("beacons")}>
              <Text style={styles.text}>Beacons</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menueleactive}>
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
    borderColor: 'black',
    margin: 10,
  },
  menueleactive: {
    backgroundColor: '#1E90FF',
    borderColor: 'black',
    margin: 10,
  },
  text: {
    fontSize: 20,
  }
});

