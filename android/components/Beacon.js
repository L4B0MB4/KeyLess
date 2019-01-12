import { DeviceEventEmitter } from "react-native";
import Kontakt from "react-native-kontaktio";
const { connect, startScanning } = Kontakt;


export async function startBeaconScanning(beaconAppeared, beaconDisappeared) {
  const granted = await getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, "Location");
  if (!granted) return;
  initializeBeaconDetectors(eddystoneAppeared, eddystoneDisappeared, ibeaconAppeared, ibeaconDisappeared);
  await connect(
    undefined,
    ["EDDYSTONE"],
    ["IBEACON"]
  );
  startScanning();
}

export function initializeBeaconDetectors(eddystoneDidAppear, eddystoneDidDisappear, ibeaconDidAppear, ibeaconDidDisappear) {
  DeviceEventEmitter.addListener("eddystoneDidAppear", ({ eddystone, namespace }) => {
    eddystoneDidAppear(eddystone);
  });

  DeviceEventEmitter.addListener("beaconDidAppear", ({ beacon, region }) => {
    beaconDidAppear(beacon);
  });

  DeviceEventEmitter.addListener("eddystoneDidDisappear", ({ eddystone, namespace }) => {
    eddystoneDidDisappear(eddystone);
  });

  DeviceEventEmitter.addListener("beaconDidDisappear", ({ beacon, region }) => {
    beaconDidDisappear(beacon);
  });

  DeviceEventEmitter.addListener("namespaceDidEnter", ({ namespace }) => {});

  DeviceEventEmitter.addListener("regionDidEnter", ({ region }) => {});

  DeviceEventEmitter.addListener("scanStatus", status => {});
}
