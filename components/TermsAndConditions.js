import React, { Component } from 'react';
import { View, Text, Platform, AsyncStorage, Modal, ActivityIndicator, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Image, } from 'react-native';
import { Notifications } from 'expo';
import Constants from 'expo-constants'
import * as Location from 'expo-location'
// import {createStackNavigator,createAppContainer,NavigationActions } from 'react-navigation';
import * as Permissions from 'expo-permissions'
import HTMLView from 'react-native-htmlview';
import { callTaskManager } from './Auth'; 
import Url from '../components/Urls';
import { apiCall } from '../components/FourQuarts.Service';

// import firebase from 'firebase';
// const firebaseConfig = {
// apiKey:"AIzaSyA8Fabx1XtDKkHyDcIwqnv5PRCHd4EhWxU", //"<YOUR-API-KEY>",
// // authDomain:"https://vona-react-6ba1f.firebaseapp.com",//"vona-fcb2a.firebaseapp.com", //"<YOUR-AUTH-DOMAIN>",
//  databaseURL: "https://vona-react-6ba1f.firebaseio.com/",
// //"<YOUR-DATABASE-URL>",
// //storageBucket: "vona-fcb2a.appspot.com"//"<YOUR-STORAGE-BUCKET>"
// }
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

class TermsAndConditions extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    //  headerLeft: <BackTitle />,
    headerRight: <Text style={{ marginRight: 10 }}>Welcome {navigation.state.params.name} </Text>,
    headerTitle: (<Image style={{ width: 35, height: 35, alignItems: 'flex-start', padding: 0 }} resizeMode="contain" source={{uri:navigation.state.params.icon}} />
    ),
    title: null
  });
  state = {
    accepted: false
  }
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      terms: '',
      VONAId: null,
      pmId: null
    }
    // if (!firebase.apps.length) {
    // firebase.initializeApp(firebaseConfig);
    // }
  }
  componentWillMount = async () => {
    try {
      const value = await AsyncStorage.getItem('loginData')
      if (value !== null) {
        let d = JSON.parse(value);
         this.setState({
          terms: d.Item.terms,
          VONAId: d.Item.VONAId,
          pmId: d.Item.pmId,
          loading: false
        })
      }
    } catch (e) {
      console.log('No data', e)
    }


  }
  agree_Tnc = async () => {
    this.setState({
      loading: true
    })
    let token = null;
    try {
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token,'getExpoPushTokenAsync')
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false
      })

    }
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;
    const secureId = await AsyncStorage.getItem('secureId')
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      alert(finalStatus);
      return;
    }
    // Get the token that uniquely identifies this device

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'OOPs, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
      // this.props.navigation.navigate('Root');  
 //http://devapi.tracktechllc.com/tracktech/api/PMAccountProfile/AcceptVONATC
      let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
         console.log(JSON.stringify({
          VONAId: this.state.VONAId,
          pmId: this.state.pmId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          heading: location.coords.heading,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
          VONAInviteCode: secureId,
          deviceToken: token
        }),'TERMS');
        let SelUrl = await AsyncStorage.getItem('url');
        let body=JSON.stringify({
          VONAId: this.state.VONAId,
          pmId: this.state.pmId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          heading: location.coords.heading,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
          VONAInviteCode: secureId,
          deviceToken: token
        });
      
      await apiCall(SelUrl+Url.API.TERMS_CONDITIONS,'post',body) 
        .then((responseJson) => {
          if(responseJson.Valid){
            this.setState({
              loading: false
            })
            AsyncStorage.setItem('TC', JSON.stringify(responseJson), () => { });
            this.props.navigation.navigate('Active');
           }else {
            console.log(responseJson, 'DEVICE TOKEN');
           }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };


  render() {
    //  var htmlContent = '<p><a href="http://jsdf.co">&hearts; nice job!</a></p>';
    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.loading}
          onRequestClose={() => { console.log('close modal') }}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={this.state.loading} />
            </View>
          </View>
        </Modal>
        <Text style={styles.title}>Terms and conditions</Text>
        <ScrollView
          style={styles.tcContainer}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              this.setState({
                accepted: true
              })
            }
          }}
        >
          <HTMLView value={this.state.terms} style={styles.title} />
        </ScrollView>

        <TouchableOpacity disabled={!this.state.accepted} onPress={this.agree_Tnc} style={this.state.accepted ? styles.button : styles.buttonDisabled}><Text style={styles.buttonLabel}>Accept</Text></TouchableOpacity>
      </View>

    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = {

  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    flex: 1
    // height: Dimensions.get('window').height,
  },
  title: {
    alignSelf: 'center'
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * .75
  },

  button: {
    backgroundColor: '#136AC7',
    borderRadius: 5,
    padding: 10
  },

  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10
  },

  buttonLabel: {
    fontSize: 14,
    color: '#FFF',
    alignSelf: 'center'
  },
  container1: {
    backgroundColor: '#CCCCCC',
    height: Dimensions.get('window').height,
    padding: 15,
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: 50
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }

}

export default TermsAndConditions;