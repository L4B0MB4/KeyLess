import { DeviceEventEmitter } from "react-native";
import Kontakt from "react-native-kontaktio";
const { connect, startScanning } = Kontakt;
import { getPermission } from "./Permission";
import { PermissionsAndroid } from "react-native";


export async function startBeaconScanning(eddystoneAppeared, eddystoneDisappeared, beaconAppeared, beaconDisappeared) {
  const granted = await getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, "Location");
  if(!granted) return;
  initializeBeaconDetectors(eddystoneAppeared, eddystoneDisappeared, beaconAppeared, beaconDisappeared);
  await connect(
    undefined,
    ["EDDYSTONE", "IBEACON"]
  );
  startScanning();
}

export function initializeBeaconDetectors(eddystoneDidAppear, eddystoneDidDisappear, beaconDidAppear, beaconDidDisappear) {
  
  DeviceEventEmitter.addListener("eddystoneDidAppear", ({ eddystone, namespace }) => {
    console.log("eddystoneDidAppear", eddystone, namespace);
    eddystoneDidAppear(eddystone);
  });

  DeviceEventEmitter.addListener("eddystoneDidDisappear", ({ eddystone, namespace }) => {
    console.log("eddystoneDidDisappear", eddystone, namespace);
    eddystoneDidDisappear(eddystone);
  });

  DeviceEventEmitter.addListener("beaconDidAppear", ({ beacon, region }) => {
    console.log("beaconDidAppear", beacon, region);
    beaconDidAppear(beacon);
  });

  DeviceEventEmitter.addListener("beaconDidDisappear", ({ beacon, region }) => {
    console.log("beaconDidDisappear", beacon, region);
    beaconDidDisappear(beacon);
  });

  DeviceEventEmitter.addListener("namespaceDidEnter", ({ namespace }) => {});

  DeviceEventEmitter.addListener("regionDidEnter", ({ region }) => {});

  DeviceEventEmitter.addListener("scanStatus", status => {});
}
