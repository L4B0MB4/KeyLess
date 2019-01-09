import { PermissionsAndroid } from "react-native";

export async function getPermission(permissionName, shortName) {
  try {
    const grantedResponse = await PermissionsAndroid.request(permissionName, {
      title: shortName + " Permission",
      message: "Beacon App needs access to your " + shortName + " to work properly."
    });
    if (grantedResponse === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
  } catch (err) {
    console.warn(err);
  }
  return false;
}
