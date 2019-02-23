import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { Actions } from "react-native-router-flux";
// Import the react-native-sound module
import Sound from "react-native-sound";

export default class AudioSCreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: "",
      isPlaying: false
    };
  }

  audio = () => {
    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.
    var sampleSound = new Sound("advertising.mp3", "https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/", error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      // loaded successfully
      console.log("duration in seconds: " + sampleSound.getDuration() + "number of channels: " + sampleSound.getNumberOfChannels());
      // Play the sound with an onEnd callback
      sampleSound.setVolume(4);
      sampleSound.play((success, err) => {
        if (success) {
          console.log("successfully finished playing");
          sampleSound.release();
          this.setState({ isPlaying: false });
        } else {
          console.log("playback failed due to audio decoding errors");
          console.log(err);
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          sampleSound.reset();
        }
      });
    });

    this.setState({ isPlaying: true });

    // Get properties of the player instance
    console.log("volume: " + sampleSound.getVolume());
    console.log("pan: " + sampleSound.getPan());

    sampleSound.play(() => {
      // Release the audio player resource
    });
  };

  render() {
    return (
      <View>
        <Button title="Play" onPress={this.audio} />
        {this.state.isPlaying ? <Text>Playing</Text> : null}
      </View>
    );
  }
}
