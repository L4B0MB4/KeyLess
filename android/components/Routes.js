import React from "react";
import { Router, Scene } from "react-native-router-flux";
import Home from "./Home.js";
import BeaconScreen from "./BeaconScreen";

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="home" component={Home} title="Home" initial={true} />
      <Scene key="beacons" component={BeaconScreen} title="Beacons" />
    </Scene>
  </Router>
);
export default Routes;
