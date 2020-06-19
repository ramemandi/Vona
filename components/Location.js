import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet,TouchableOpacity } from 'react-native';
import {  Location, Permissions  } from 'expo';
import * as Constants from 'expo-constants';
export const LOCATION_TASK_NAME = 'background-location-updates'

// TaskManager.defineTask(BACKGROUND_LOCATION_UPDATES_TASK, initializeBackgroundLocation)

// export async function handleLocationUpdate({ data, error }) {
//     console.log('location update')
//     if (error) {
// 		return
// 	}
//      if (data) {
//         try {
//             const { locations } = data
//             console.log('locations',locations)
//         } catch (error) {
//             console.log('the error',error)
//         }
//     }
// }

// export async function initializeBackgroundLocation(){
//     let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)
//     if (!isRegistered) await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK, {
//         accuracy: Location.Accuracy.High,
//         /* after edit */
//         timeInterval: 2500,
//         distanceInterval: 5,
//     })
//     handleLocationUpdate()
// }
export default class CurrentLocation extends Component {
  state = {
    location: null,
    errorMessage: null,
    currentLocations:null
  };
  constructor(props){
    super(props);
    //    Location.startLocationUpdatesAsync('firstTask', {
    //   accuracy: Location.Accuracy.Balanced   
    // })
  }
  UNSAFE_componentWillMount = async ()=> {
    console.log(Platform.OS,Constants.isDevice, 'componentWillMount');
 
    if (Platform.OS === 'android' && !Constants.isDevice) {
    this.setState({
    errorMessage:
    null
    // 'OOPs, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else { 
    //  await Location.startLocationUpdatesAsync('firstTask', {
    //   accuracy: Location.Accuracy.Balanced,
    // });
      this._getLocationAsync();
      // this._startLocationUpdates();
    }
  }
 onPress = async () => {
   setInterval(async()=>{
    // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    //   accuracy: Location.Accuracy.Balanced,
    //   timeInterval: 15000,
    //     distanceInterval: 5,
    // });
   },15000)
    
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status, 'status');
    if (status !== 'granted') {
      console.log(status, 'status');
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({accuracy:5});
    console.log(location, 'location');
    this.setState({ location });
 
  };
//  _startLocationUpdates = async () => {
//      await Location.startLocationUpdatesAsync('TASKS_GEOLOCATION_UPDATES', {
//         accuracy: Location.Accuracy.High,
//         /* after edit */
//         timeInterval: 1000,
//         distanceInterval: 5,
//     })
 
//   };
  render() {
    let text = 'Waiting..'; 
    let text1='test';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    // if(this.state.currentLocation){
    //   text1 = JSON.stringify(this.state.currentLocations);
    // } 

    return (
      <View style={styles.container}>
        {/* <Text style={styles.paragraph}>{text}</Text> */}
        {/* <TouchableOpacity onPress={this.onPress}> */}
        <TouchableOpacity>
        <Text>Coming soon</Text>
        {/* <Text style={styles.paragraph}></Text> */}
        </TouchableOpacity>
      </View>
      
    );
  }
}

//  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     return;
//   }
//   if (data) {
//     const { currentLocation } = data.locations;
//     console.log(data,'location data');
//     // this.setState({currentLocation});
//     //  console.log( JSON.stringify(this.state.currentLocation),'location data');
//     // do something with the locations captured in the background
//   }
// });
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
