import React, { Component } from "react";
import { TouchableOpacity, Text, View, Button, Picker } from "react-native";
const IP = "192.168.0.102:8080";

export default class RequestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { requests: [] };
  }

  auth = "811D626D-6D25-464C-9501-57592983F0B8";
  interValSet = false;

  openDoorOwner = async () => {
    try {
      let response = await fetch("http://" + IP + "/azure/owner?auth=" + this.auth, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          command: "open-door",
          for: "beacon-adress-placeholder"
        })
      });
      let responseJson = await response.json();
      console.log(responseJson);
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  getRequests = async () => {
    try {
      let response = await fetch("http://" + IP + "/azure/owner?auth=" + this.auth);
      let requests = await response.json();
      console.log(requests);
      if (requests.success == true || requests.success === false) {
        return this.setState({ requests: null });
      }
      if (!Array.isArray(requests)) {
        requests = [requests];
      }
      this.setState({ requests });
    } catch (ex) {
      console.log("ERROR: " + ex);
    }
  };

  componentDidMount = () => {
    if (this.interValSet === false) {
      this.interValSet = true;
      this.getRequests();
      setInterval(this.getRequests, 1000);
    }
  };

  render() {
    const { requests } = this.state;
    return (
      <View>
        {requests
          ? requests.map(item => (
              <React.Fragment key={JSON.stringify(item)}>
                <Button onPress={this.openDoorOwner} title={new Date(item.db_timestamp).toLocaleTimeString() + " Uhr. Öffne deinem Besucher die Tür"} />
              </React.Fragment>
            ))
          : null}
      </View>
    );
  }
}
