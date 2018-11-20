/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow*/
 
import React, { Component } from 'react';
import { Platform, Text, View, DeviceEventEmitter, StyleSheet, AppRegistry } from 'react-native';
import { PermissionsAndroid } from 'react-native';
 
import Kontakt from 'react-native-kontaktio';
const { connect, startScanning } = Kontakt;
 
export default class Beacon extends Component {

  constructor(props) {
    super(props);
     this.state = {
      beaconName: '',
      beaconAddress: '',
      beaconNamespace: '',
    };
  }

  async getPermission(){
     try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'Beacon App needs access to your location ' +
                   'so you can locate Beacons.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the location")
    } else {
      console.log("Location permission denied")
    }


    connect(undefined,["EDDYSTONE"])
      .then(() => {console.log("connect");startScanning()})
      .catch(error => console.log('error', error));
 
    
  } catch (err) {
    console.warn(err)
  }
}


  componentDidMount() {
    DeviceEventEmitter.addListener(
      'eddystoneDidAppear',
      ({ eddystone,namespace}) => {
        console.log('eddystoneDidAppear', eddystone,namespace);
        this.setState({
          beaconName: eddystone.name,
          beaconAddress: eddystone.address,
          beaconNamespace: eddystone.namespace
        });
      },
    );

    DeviceEventEmitter.addListener(
      'eddystoneDidDisappear',
      ({ eddystone,namespace}) => {
        console.log('eddystoneDidDisappear', eddystone,namespace);
        this.setState({
          beaconName: '',
          beaconAddress: '',
          beaconNamespace: ''
        });
      },
    );

    DeviceEventEmitter.addListener(
      'namespaceDidEnter',
      ({ namespace}) => {
        console.log('namespaceDidEnter',namespace);
      },
    );
    

    DeviceEventEmitter.addListener(
      'scanStatus',
      (status) => {
        console.log('scanStatus', status);
      },
    );
    this.getPermission().then(()=>console.log("permissions")).catch((err)=>console.log(err))


    try{
      fetch('192.168.0.45')
        .then(response => {
          if (response.status === 200) {
            //return response.json();
            console.log(response.json());
          } else {
            console.log("kein flask :(")
            throw new Error('Something went wrong on api server!');
          }
        })
        .then(response => {
          console.debug("debug response: "+response);
        }).catch(error => {
          console.error("error: "+error);
        });
    } catch(error){
      console.log(error);
    }

  }
 

  render() {
    const { beaconAddress, 
      beaconName,
      beaconNamespace } =  this.state;
    if (beaconAddress == 'C4:E7:AA:00:E5:7D' && beaconNamespace == '646f6f72426561636f6e') {
      text = <Text>Dein Beacon "{beaconName}" ist in der Nähe. Die Tür wird jetzt geöffnet.</Text>;    
    } else {
      text = <Text>Dein Beacon wurde nicht in der Nähe erkannt.</Text>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Smarte Haustüröffnung</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    ); 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 25,
    margin: 20,
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
});