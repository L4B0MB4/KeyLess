import { DeviceEventEmitter } from "react-native";
import Kontakt from "react-native-kontaktio";
import { getPermission } from "./Permission";
const { connect, startScanning } = Kontakt;
import { PermissionsAndroid } from "react-native";

export async function startBeaconScanning(beaconAppeared, beaconDisappeared) {
  const granted = await getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, "Location");
  if (!granted) return;
  initializeBeaconDetectors(beaconAppeared, beaconDisappeared);
  await connect(
    undefined,
    ["EDDYSTONE"]
  );
  startScanning();
}

export function initializeBeaconDetectors(eddystoneDidAppear, eddystoneDidDisappear) {
  DeviceEventEmitter.addListener("eddystoneDidAppear", ({ eddystone, namespace }) => {
    eddystoneDidAppear(eddystone);
  });

  DeviceEventEmitter.addListener("eddystoneDidDisappear", ({ eddystone, namespace }) => {
    eddystoneDidDisappear(eddystone);
  });

  DeviceEventEmitter.addListener("namespaceDidEnter", ({ namespace }) => {});

  DeviceEventEmitter.addListener("scanStatus", status => {});
}
