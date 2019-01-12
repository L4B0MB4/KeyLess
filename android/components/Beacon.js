import { DeviceEventEmitter } from "react-native";
import Kontakt from "react-native-kontaktio";
const { connect, startScanning } = Kontakt;


export async function startBeaconScanning(beaconsDidUpdate, eddystonesDidUpdate) {
  const granted = await getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, "Location");
  if (!granted) return;
  initializeBeaconDetectors(beaconsDidUpdate, eddystonesDidUpdate);
  await connect(
    undefined,
    ["EDDYSTONE", "IBEACON"]
  );
  startScanning();
}

export function initializeBeaconDetectors(beaconsDidUpdate, eddystonesDidUpdate) {
  DeviceEventEmitter.addListener("eddystonesDidUpdate", ({ eddystones, namespace }) => {
    console.log('eddystonesDidUpdate', eddystones, namespace);
    eddystonesDidUpdate(eddystones);
  });

  DeviceEventEmitter.addListener("beaconsDidUpdate", ({ beacons, region }) => {
    console.log('beaconsDidUpdate', beacons, region);
    beaconsDidUpdate(beacons);
  });

  DeviceEventEmitter.addListener("namespaceDidEnter", ({ namespace }) => {});

  DeviceEventEmitter.addListener("regionDidEnter", ({ region }) => {});

  DeviceEventEmitter.addListener("scanStatus", status => {});
}
