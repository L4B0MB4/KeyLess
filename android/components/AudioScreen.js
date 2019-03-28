import React, { Component } from "react";
import { Text, View, Button } from "react-native";
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

  render() {
    return (
      <View>
        <Button title="Play" onPress={this.audio} />
        {this.state.isPlaying ? <Text>Playing</Text> : null}
      </View>
    );
  }
}
