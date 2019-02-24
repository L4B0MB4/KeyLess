import { DeviceEventEmitter } from "react-native";
import Kontakt from "react-native-kontaktio";
import { getPermission } from "./Permission";
const { connect, startScanning } = Kontakt;
import { PermissionsAndroid } from "react-native";

export async function startBeaconScanning(eddystoneAppeared, eddystoneDisappeared, beaconAppeared, beaconDisappeared) {
  const granted = await getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, "Location");
  if (!granted) return;
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
    if (eddystoneDidAppear) eddystoneDidAppear(eddystone);
  });

  DeviceEventEmitter.addListener("eddystoneDidDisappear", ({ eddystone, namespace }) => {
    console.log("eddystoneDidDisappear", eddystone, namespace);
    if (eddystoneDidDisappear) eddystoneDidDisappear(eddystone);
  });

  DeviceEventEmitter.addListener("beaconDidAppear", ({ beacon, region }) => {
    //console.log("beaconDidAppear", beacon, region);
    if (beaconDidAppear) beaconDidAppear(beacon);
  });

  DeviceEventEmitter.addListener("beaconDidDisappear", ({ beacon, region }) => {
    //console.log("beaconDidDisappear", beacon, region);
    if (beaconDidDisappear) beaconDidDisappear(beacon);
  });

  DeviceEventEmitter.addListener("namespaceDidEnter", ({ namespace }) => {});

  DeviceEventEmitter.addListener("regionDidEnter", ({ region }) => {});

  DeviceEventEmitter.addListener("scanStatus", status => {});
}
