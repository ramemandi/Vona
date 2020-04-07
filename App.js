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
import * as TaskManager from 'expo-task-manager';
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
import { Provider } from 'react-redux';
import store from './components/store/index';
import Url from './components/Urls';

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
  //HomeScreen: Home,   
  //  Welcome: Welcome,
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
  Welcome: Welcome,
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
const testContainer = createStackNavigator({
  HomeScreen: Home,
  appStackNavigator1
}, { headerMode: "none" })

export const AppContainer = createAppContainer(appStackNavigator);
// const AppContainer1 = createAppContainer(appStackNavigator1);
export const AppContainer1 = createAppContainer(testContainer);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      appState: AppState.currentState,
    };

    this.playbackInstance = null;
  }
  componentDidMount() {
    //console.log(AppState.currentState, 'current stats'); 
    //AsyncStorage.clear();
    isSignedIn().then(async (res) => {
      this.setState({ signedIn: res, checkedSignIn: true });
    }).catch(err => { console.log(err) });

    CheckConnectivity();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true
    });
  };
  render() {
    const { checkedSignIn, signedIn } = this.state;
    // console.log(signedIn, 'current signedIn');
    // if (signedIn) {
    //   return <AppContainer />;
    // } else {
    return (<Provider store={store}><AppContainer1 /></Provider>);
    // }
  }
}
if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {

    var playbackInstance = null;
    if (error) {
      // await axios.get("http://192.168.1.107:8000/error");
      return
    }
    // console.log(AppState.currentState, 'test taskmanager')
    const value = await AsyncStorage.getItem('loginData');
    const secureId = await AsyncStorage.getItem('secureId');
    let d = JSON.parse(value);

    if (data && d) {
      let vonaid = null;
      let pmId = null;
      let vonaUserType = null;
      var dateTime = new Date();
      dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
      try {
        if (d !== null) {
          vonaid = d.Item.VONAId,
            pmId = d.Item.pmId,
            vonaUserType = d.Item.VONAUserType
        }
      } catch (e) {
        console.log('No data', e)
      }

      if (playbackInstance != null) {
        await playbackInstance.unloadAsync();
        playbackInstance.setOnPlaybackStatusUpdate(null);
        playbackInstance = null;
      }
      const source = require('./assets/alarm.mp3');
      const initialStatus = {
        shouldPlay: true,
        rate: 1.0,
        shouldCorrectPitch: true,
        volume: 1.0,
        isMuted: false
      };
      let temp = [
        { danger: [39.6188793, -104.8862246] },
        { danger: [17.6274475, 83.2089941] },
        { danger: [17.7274212, 83.3090126] }];
      let time = new Date()
      console.log(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
      let SelUrl = await AsyncStorage.getItem('url');
      console.log(SelUrl + Url.API.VONA_MEMBER_STATUS, '230');
      console.log(data, '205');

      // await fetch(Selurl+Url.API.VONA_MEMBER_STATUS, {
        // console.log(JSON.stringify({
        //   VONAId: vonaid,
        //   pmId: pmId,
        //   VONAUserType: vonaUserType,
        //   latitude: data.locations[0].coords.latitude,
        //   longitude: data.locations[0].coords.longitude,
        //   //latitude:test[0],
        //   //longitude:test[1],  
        //   accuracy: data.locations[0].coords.accuracy,
        //   heading: data.locations[0].coords.heading,
        //   altitude: data.locations[0].coords.altitude,
        //   speed: data.locations[0].coords.speed,
        //   status: null,
        //   VONAInviteCode: secureId,
        //   VONAUserDateTime: dateTime
        // }),'BODY DATA');
        
      await fetch(SelUrl + Url.API.VONA_MEMBER_STATUS, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          VONAId: vonaid,
          pmId: pmId,
          VONAUserType: vonaUserType,
          latitude: data.locations[0].coords.latitude,
          longitude: data.locations[0].coords.longitude,
          //latitude:test[0],
          //longitude:test[1],  
          accuracy: data.locations[0].coords.accuracy,
          heading: data.locations[0].coords.heading,
          altitude: data.locations[0].coords.altitude,
          speed: data.locations[0].coords.speed,
          status: null,
          VONAInviteCode: secureId,
          VONAUserDateTime: dateTime
        })
      }).then(response => response.json())
        .then(async (responseJson) => {
          // var prev_Alert = await AsyncStorage.getItem('alertType',(err)=>{console.log(err)});
           console.log(responseJson, 'responseJson');

          // console.log(prev_Alert,'prevAlert');
          // console.log(responseJson.Item.thresholdMessage,'responseJson.Item.thresholdMessage');
          // store.dispatch({ type: 'updateType', payload: {type:responseJson.Item.thresholdMessage} })
          // console.log(responseJson.Item.currentAppStatus,'responseJson.Item.currentAppStatus');
          if (responseJson && responseJson?.Item) {
            AsyncStorage.setItem('alertType', JSON.stringify({ "alertType": responseJson.Item.currentAppStatus, "message": responseJson.Item.thresholdMessage }), () => { });
            if ((responseJson.Item.currentAppStatus == 'danger')) {
              var { sound, status } = await Audio.Sound.createAsync(
                source,
                initialStatus
              );
              playbackInstance = sound;
              playbackInstance.setIsLoopingAsync(false);
              playbackInstance.playAsync();
              return true
            } else {
              return true
            }
          } else {
            return true
          }
        })
        .catch(error => {
          console.log(error);
        });
      // return data; 
    }
  });
}
