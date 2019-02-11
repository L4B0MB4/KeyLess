import React from "react";
import { Router, Scene } from "react-native-router-flux";
import Home from "./Home.js";
import BeaconScreen from "./BeaconScreen";
import AudioSCreen from "./AudioScreen.js";

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="home" component={Home} title="Home" initial={true} />
      <Scene key="beacons" component={BeaconScreen} title="Beacons" />
      <Scene key="audio" component={AudioSCreen} title="Audio" />
    </Scene>
  </Router>
);
export default Routes;
