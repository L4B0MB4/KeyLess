import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export default class BeaconScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>BeaconScreen</Text>
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
