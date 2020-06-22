import * as React from 'react';
import { Text, View, StyleSheet, AppRegistry, AsyncStorage, AppState, DeviceEventEmitter } from 'react-native';

import { createAppContainer, StackNavigator, createDrawerNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
// You can import from local files
import Welcome from './components/Welcome';
import Home from './components/Home';
import FourQuarts from './components/FourQuarts';
import NoThreats from './components/NoThreats';
import ActiveThreats from './components/ActiveThreats';
import Danger from './components/Danger';
import CurrentLocation from './components/Location';
import TermsAndConditions from './components/TermsAndConditions';
import { isSignedIn } from './components/Auth';
import Lazyload from './components/Lazyload';
import moment from 'moment';
// import * as TaskManager from 'expo-task-manager';
// import { Card } from 'react-native-paper';
// Import the react-native-sound module
import { Audio } from 'expo-av';
import { CheckConnectivity } from './components//NetworkConnection';
import QRscanner from './components/Qrscanner';
const LOCATION_TASK_NAME = 'background-location-tasks';
import PanicOptions from './components/panicOptions';
import Resources from './components/Resources'
// import Coding from './components/Coding';
import MapViews from './components/MapView';
import WebViewPage from './components/Webview';
// import { Provider } from 'react-redux';
// import store from './components/store/index';
import Url from './components/Urls';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
// import * as FileSystem from 'expo-file-system';

import BackgroundJob from 'react-native-background-actions';
import RNLocation from "react-native-location";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
//  https://beta-api.tracktechllc.com/api/PMAccountProfile/LogVONAMemberStatus

const PostData = async () => {
  console.log('Came to postData');
  console.log('Change works means android bundle works');
  console.log('avinash');
  console.log('data object');
  const value = await AsyncStorage.getItem('loginData');
  console.log(value, 'loginData');
  const secureId = await AsyncStorage.getItem('secureId');
  console.log(secureId, 'secureId');
  const SelUrl = await AsyncStorage.getItem('url');
  console.log(SelUrl, 'SelUrl');
  let d = JSON.parse(value);
  console.log(d, 'after parse');
  var data = null;
  var callonce = 1;
  if (d !=null ) {

    let vonaid = null;
    let pmId = null;
    let vonaUserType = null;
    var dateTime = new Date();
       // let data = null;
    dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    try {
      console.log('came try block');
      if (d !== null) {
        vonaid = d.Item.VONAId,
        pmId = d.Item.pmId,
        vonaUserType = d.Item.VONAUserType;
        console.log(vonaid, 'vonaid');
        console.log(pmId, 'pmId');
        console.log(vonaUserType, 'vonaUserType');
        let locationSubscription = RNLocation.subscribeToLocationUpdates(
          locations => {

            console.log(locations,'total locations');
            data = locations[0];
            console.log(locations[0], 'rambabu location');
            console.log(data.longitude, 'data longitude');
            // let ret = PostData(data);
            // console.log(ret, 'postData returned')
            if(data !=null){
              console.log(JSON.stringify({
                VONAId: vonaid,
                pmId: pmId,
                VONAUserType: vonaUserType,
                latitude: data.latitude,
                longitude: data.longitude,
                accuracy: data.accuracy,
                heading: 0,
                altitude: data.altitude,
                speed: data.speed,
                status: null,
                VONAInviteCode: secureId,
                VONAUserDateTime: dateTime
              }),'TASK RANDOM-82');
            }
          
            if(data !=null){
              console.log(data,'came to if ');
              console.log(callonce,'callonce');

            if(callonce == 1){
             fetch(SelUrl + Url.API.VONA_MEMBER_STATUS, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                VONAId: vonaid,
                pmId: pmId,
                VONAUserType: vonaUserType,
                latitude: data.latitude,
                longitude: data.longitude,
                accuracy: data.accuracy,
                heading: 0,
                altitude: data.altitude,
                speed: data.speed,
                status: null,
                VONAInviteCode: secureId,
                VONAUserDateTime: dateTime
              })
            }).then(response => response.json())
              .then(async (responseJson) => {
                console.log('response from',125);
                // var prev_Alert = await AsyncStorage.getItem('alertType',(err)=>{console.log(err)});
                console.log(responseJson, '39');
                if (responseJson) {
                  AsyncStorage.setItem('alertType', JSON.stringify({ "alertType": responseJson.Item.currentAppStatus, "message": responseJson.Item.thresholdMessage }), () => { });
                  console.log('if 58');
                  return true;
                } else {
                  console.log('else 45');
                  return false
                }
              })
              .catch(error => {
                console.log('Came error block' + error);
        
                return false;
              });
              } 
              callonce++;
              console.log(callonce,'callonce') 
            }else {
              console.log('nothing happening', 164)
              return null;
            }
          });
          setTimeout(() => {
          locationSubscription();
          }, 5000);
        // this.setState({ location: locations[0] });
       }
    } catch (e) {
      console.log('No data', e)
    }

  
   
  } else {
    console.log('No login data in local storage');
  }
}

const options = {
  taskName: 'Example',
  taskTitle: 'Protection Mode',
  taskDesc: 'on',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 60000,
  },
};

const taskRandom = async taskData => {
  if (Platform.OS === 'ios') {
    console.log(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.',
    );
  }
  await new Promise(async resolve => {
    // For loop with a delay
    const { delay } = taskData;
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Runned -> ',i);
      let ret = PostData();
      console.log(ret,'postData returned')
      await sleep(delay);
        // locationSubscription() 
    }
  });
};

export const toggleBackground = async () => {
  console.log('playing');
  console.log('remove RNLocation configs');

  // this.playing = !this.playing;
  // if (this.playing) {
  try {
    console.log('Trying to start background service');
    RNLocation.configure({
      distanceFilter: 100,
      desiredAccuracy: {
        ios: "best",
        android: "balancedPowerAccuracy"
      },
      // Android only
      androidProvider: "auto",
      interval: 90000, // Milliseconds
      fastestInterval: 60000, // Milliseconds
      // maxWaitTime: 30000
    });
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "fine",
        rationale: {
          title: "Location permission",
          message: "We use your location to demo the library",
          buttonPositive: "OK",
          buttonNegative: "Cancel"
        }
      }
    }).then(granted => {
      console.log('granted the permission', 136);
      if (granted) {
        console.log('location permission granted by RNLocation');
      }
    });

    await BackgroundJob.start(taskRandom, options);
    //  await taskRandom(options);
    console.log('Successful start!');
  } catch (e) {
    // await BackgroundJob.stop();
    console.log('Error', e);
  }
  // } else {
  //   console.log('Stop background service');
  //   await BackgroundJob.stop();
  // }
};

export const Tab_2 = createMaterialTopTabNavigator({
  NoThreats: {
    screen: NoThreats,
    navigationOptions: {
      tabBarLabel: "No Threats",
      showIcon: true,
      tabBarIcon: ({ tintColor }) => (
        <Image style={{ width: 35, height: 35, padding: 0 }} source={require('./assets/danger.png')} />
      )
    },
  },
  Active: {
    screen: ActiveThreats,
  },
  Danger: {
    screen: Danger,
  }
}, {
  tabBarPosition: 'top',
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: '#fff',
    pressColor: '#004D40',
    inactiveTintColor: '#fff',
    upperCaseLabel: false,
    style: {
      backgroundColor: '#0061a7',
    },

    labelStyle: {
      fontSize: 16,
      fontWeight: '200',

    }
  }

});

const appStackNavigator = createStackNavigator({
  // HomeLoading:HomeLoading
  HomeScreen: Home,
  Welcome: Welcome,
  Active: FourQuarts,
  CurrentLocation: CurrentLocation,
  Terms: TermsAndConditions,
  Tabs: Tab_2,
  Lazyload: Lazyload,
  panic: PanicOptions,
  MapView: MapViews,
  resources: Resources,
  webView: WebViewPage
  // HomeLoading:HomeLoading
});
// const LoginStack = createStackNavigator({
//   HomeScreen: Home,
// },{headerMode:""})
const appStackNavigator1 = createStackNavigator({
  // LoadingScreen: LoadingScreen,

  // Coding:Coding, 
  Active: FourQuarts,
  // Welcome: Welcome,
  CurrentLocation: CurrentLocation,
  // Terms: TermsAndConditions,
  Tabs: Tab_2,
  Lazyload: Lazyload,
  panic: PanicOptions,
  MapView: MapViews,
  resources: Resources,
  webView: WebViewPage
  // HomeLoading:HomeLoading
});
const testContainer = createStackNavigator({
  // HomeScreen: Home,
  appStackNavigator1
}, { headerMode: "none" })

export const AppContainer = createAppContainer(appStackNavigator);
export const AppContainer1 = createAppContainer(appStackNavigator1);
// export const AppContainer1 = createAppContainer(testContainer);

export default class App extends React.Component {
  // fileUri = FileSystem.documentDirectory + "VonaLogs.txt";
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      appState: AppState.currentState,
      fontLoaded:false
    };
    this.playbackInstance = null;
  }
  // playing = BackgroundJob.isRunning();

  /**
   * Toggles tlhe background task
   */

  componentDidMount = async () => {
    //console.log(AppState.currentState, 'current stats'); 
    //AsyncStorage.clear();'./assets/fonts/open-sans/OpenSans-Bold.ttf'
    setTimeout(() => SplashScreen.hideAsync(), 2000);
    await Font.loadAsync({
      'open-sans-bold': require('./assets/fonts/open-sans/OpenSans-Bold.ttf')
    });
    this.setState({fontLoaded:true});
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    await isSignedIn().then(async (res) => {
      console.log(res, '131');
      // console.log(this.fileUri, '131');
      // await FileSystem.writeAsStringAsync(this.fileUri, 'Console .log 148', { encoding: FileSystem.EncodingType.UTF8 });
      this.setState({ signedIn: res, checkedSignIn: true });
    }).catch(err => { console.log(err) });

    // CheckConnectivity();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true
    });
    // Optional: Check if the device is blocking background tasks or not
    // this.checkStatus();
    // await (AsyncStorage.getItem('secureId', (error, secureId) => {
    //   if (error) {
    //     this.props.navigation.navigate('HomeScreen');
    //   } else {
    //     if(secureId){
    //       this.toggleBackground()
    //     }
    //   }
    // }));

  };


  render() {
    // const { checkedSignIn, signedIn } = this.state;
    console.log(this.state.signedIn, '148');
    console.log(this.state.fontLoaded, 'fontLoaded');
    if (this.state.signedIn) {
      return <AppContainer1 />;
    } else {
      return <AppContainer />;
    }
    // return (<Provider store={store}><AppContainer1 /></Provider>);

  }
}




// if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
//   TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//     var playbackInstance = null;
//     if (error) {
//       // await axios.get("http://192.168.1.107:8000/error");
//       return
//     }
//     const value = await AsyncStorage.getItem('loginData');
//     const secureId = await AsyncStorage.getItem('secureId');
//     let d = JSON.parse(value);

//     if (data && d) {
//       let vonaid = null;
//       let pmId = null;
//       let vonaUserType = null;
//       var dateTime = new Date();
//       dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
//       try {
//         if (d !== null) {
//           vonaid = d.Item.VONAId,
//             pmId = d.Item.pmId,
//             vonaUserType = d.Item.VONAUserType
//         }
//       } catch (e) {
//         console.log('No data', e)
//       }

//       if (playbackInstance != null) {
//         await playbackInstance.unloadAsync();
//         playbackInstance.setOnPlaybackStatusUpdate(null);
//         playbackInstance = null;
//       }
//       const source = require('./assets/alarm.mp3');
//       const initialStatus = {
//         shouldPlay: true,
//         rate: 1.0,
//         shouldCorrectPitch: true,
//         volume: 1.0,
//         isMuted: false
//       };
//        let time = new Date()
//       console.log(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
//       let SelUrl = await AsyncStorage.getItem('url');
//         console.log(JSON.stringify({
//         VONAId: vonaid,
//         pmId: pmId,
//         VONAUserType: vonaUserType,
//         latitude: data.locations[0].coords.latitude,
//         longitude: data.locations[0].coords.longitude,
//         // latitude: test.danger[0],
//         // longitude: test.danger[1],
//         accuracy: data.locations[0].coords.accuracy,
//         heading: data.locations[0].coords.heading,
//         altitude: data.locations[0].coords.altitude,
//         speed: data.locations[0].coords.speed,
//         status: null,
//         VONAInviteCode: secureId,
//         VONAUserDateTime: dateTime
//       }), 'BODY DATA');

//       await fetch(SelUrl + Url.API.VONA_MEMBER_STATUS, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           VONAId: vonaid,
//           pmId: pmId,
//           VONAUserType: vonaUserType,
//           latitude: data.locations[0].coords.latitude,
//           longitude: data.locations[0].coords.longitude,
//           // latitude: test.danger[0],
//           // longitude: test.danger[1],
//           accuracy: data.locations[0].coords.accuracy,
//           heading: data.locations[0].coords.heading,
//           altitude: data.locations[0].coords.altitude,
//           speed: data.locations[0].coords.speed,
//           status: null,
//           VONAInviteCode: secureId,
//           VONAUserDateTime: dateTime
//         })
//       }).then(response => response.json())
//         .then(async (responseJson) => {
//           // var prev_Alert = await AsyncStorage.getItem('alertType',(err)=>{console.log(err)});
//           console.log(responseJson, '256');
//           if (responseJson && responseJson?.Item) {
//             AsyncStorage.setItem('alertType', JSON.stringify({ "alertType": responseJson.Item.currentAppStatus, "message": responseJson.Item.thresholdMessage }), () => { });
//             if ((responseJson.Item.currentAppStatus == 'danger')) {
//               var { sound, status } = await Audio.Sound.createAsync(
//                 source,
//                 initialStatus
//               );
//               playbackInstance = sound;
//               playbackInstance.setIsLoopingAsync(false);
//               playbackInstance.playAsync();
//               return true
//             } else {
//               return true
//             }
//           } else {
//             return true
//           }
//         })
//         .catch(error => {
//           console.log(error);
//         });
//       // return data; 
//     }
//   });
// }



// BackgroundTask.define(async () => {
//   let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
//   console.log(JSON.stringify({
//     VONAId: this.state.VONAId,
//     pmId: this.state.pmId,
//     latitude: location.coords.latitude,
//     longitude: location.coords.longitude,
//     accuracy: location.coords.accuracy,
//     heading: location.coords.heading,
//     altitude: location.coords.altitude,
//     speed: location.coords.speed,
//     VONAInviteCode: secureId,
//     deviceToken: token
//   }), 'TERMS');

//   const value = await AsyncStorage.getItem('loginData');
//   const secureId = await AsyncStorage.getItem('secureId');
//   let d = JSON.parse(value);

//   if (d) {
//     let vonaid = null;
//     let pmId = null;
//     let vonaUserType = null;
//     var dateTime = new Date();
//     dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
//     try {
//       if (d !== null) {
//         vonaid = d.Item.VONAId,
//           pmId = d.Item.pmId,
//           vonaUserType = d.Item.VONAUserType
//       }
//     } catch (e) {
//       console.log('No data', e)
//     }

//     if (playbackInstance != null) {
//       await playbackInstance.unloadAsync();
//       playbackInstance.setOnPlaybackStatusUpdate(null);
//       playbackInstance = null;
//     }
//     const source = require('./assets/alarm.mp3');
//     const initialStatus = {
//       shouldPlay: true,
//       rate: 1.0,
//       shouldCorrectPitch: true,
//       volume: 1.0,
//       isMuted: false
//     };
//     let temp = [
//       { danger: [17.7182537, 83.3222951] },
//       { danger: [17.7082537, 83.3122951] },
//       { danger: [17.7088000, 83.3128000] }];
//     // "latitude":17.7082537,"longitude":83.3122951,
//     let time = new Date()
//     console.log(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
//     let SelUrl = await AsyncStorage.getItem('url');
//     // console.log(SelUrl + Url.API.VONA_MEMBER_STATUS, '230');
//     // console.log(data, '205');
//     const test = temp[Math.floor(Math.random() * temp.length)];
//     console.log(test, '205');

//     // console.log(JSON.stringify({
//     //   VONAId: vonaid,
//     //   pmId: pmId,
//     //   VONAUserType: vonaUserType,
//     //   //  latitude: data.locations[0].coords.latitude,
//     //   // longitude: data.locations[0].coords.longitude,
//     //   latitude: test.danger[0],
//     //   longitude: test.danger[1],
//     //   accuracy: data.locations[0].coords.accuracy,
//     //   heading: data.locations[0].coords.heading,
//     //   altitude: data.locations[0].coords.altitude,
//     //   speed: data.locations[0].coords.speed,
//     //   status: null,
//     //   VONAInviteCode: secureId,
//     //   VONAUserDateTime: dateTime
//     // }), 'BODY DATA');

//     await fetch(SelUrl + Url.API.VONA_MEMBER_STATUS, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         //   VONAId: vonaid,
//         //   pmId: pmId,
//         //   VONAUserType: vonaUserType,
//         //  // latitude: data.locations[0].coords.latitude,
//         //  // longitude: data.locations[0].coords.longitude,
//         //   latitude:test.danger[0],
//         //   longitude:test.danger[1],  
//         //   accuracy: data.locations[0].coords.accuracy,
//         //   heading: data.locations[0].coords.heading,
//         //   altitude: data.locations[0].coords.altitude,
//         //   speed: data.locations[0].coords.speed,
//         //   status: null,
//         //   VONAInviteCode: secureId,
//         //   VONAUserDateTime: dateTime
//         VONAId: "48e93daf-4b86-4eaf-877c-6614750750c5", pmId: "5e81a67513bd7090eced606a", VONAUserType: "Victim", latitude: 17.7082537, longitude: 83.3122951, "accuracy": 116.0999984741211, heading: 0, altitude: 0, speed: 0, status: null, VONAInviteCode: "W8JK67", VONAUserDateTime: dateTime
//       })
//     }).then(response => response.json())
//       .then(async (responseJson) => {
//         // var prev_Alert = await AsyncStorage.getItem('alertType',(err)=>{console.log(err)});
//         console.log(responseJson, '256');

//         // console.log(prev_Alert,'prevAlert');
//         // console.log(responseJson.Item.thresholdMessage,'responseJson.Item.thresholdMessage');
//         // store.dispatch({ type: 'updateType', payload: {type:responseJson.Item.thresholdMessage} })
//         // console.log(responseJson.Item.currentAppStatus,'responseJson.Item.currentAppStatus');
//         if (responseJson && responseJson?.Item) {
//           AsyncStorage.setItem('alertType', JSON.stringify({ "alertType": responseJson.Item.currentAppStatus, "message": responseJson.Item.thresholdMessage }), () => { });
//           if ((responseJson.Item.currentAppStatus == 'danger')) {
//             var { sound, status } = await Audio.Sound.createAsync(
//               source,
//               initialStatus
//             );
//             playbackInstance = sound;
//             playbackInstance.setIsLoopingAsync(false);
//             playbackInstance.playAsync();
//             return true
//           } else {
//             return true
//           }
//         } else {
//           return true
//         }
//       })
//       .catch(error => {
//         console.log(error);
//       });
//     // return data; 
//   }



//   // Remember to call finish()
//   BackgroundTask.finish()
// })




