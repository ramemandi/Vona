import React, { Component } from 'react';
import { View, Text, Platform, AsyncStorage, Modal, ActivityIndicator, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Image,Alert } from 'react-native';
import { Notifications } from 'expo';
import Constants from 'expo-constants'
import * as Location from 'expo-location'
// import {createStackNavigator,createAppContainer,NavigationActions } from 'react-navigation';
import * as Permissions from 'expo-permissions'
import HTMLView from 'react-native-htmlview';
// import { callTaskManager } from './Auth';
import Url from '../components/Urls';
import { apiCall } from '../components/FourQuarts.Service';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
 
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

class TermsAndConditions extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    //  headerLeft: <BackTitle />,
    headerRight: <Text style={{ marginRight: 10,color:"black" }}>Welcome {navigation.state.params.name} </Text>,
    headerTitle: (<Image style={{ width: 35, height: 35, alignItems: 'flex-start', padding: 0 }} resizeMode="contain" source={{ uri: navigation.state.params.icon }} />
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
      pmId: null,
      token : null
    }
    // if (!firebase.apps.length) {
    // firebase.initializeApp(firebaseConfig);
    // }
  }
  UNSAFE_componentWillMount = async () => {
    try {
      const value = await AsyncStorage.getItem('loginData');
      console.log(value,'loginData');
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
  
  _showAlert = async (token) => {
    let t = JSON.stringify(token)
    Alert.alert(
      'Aviso',
      '¿Desea cerrar la sesion?',
      [
        {text: t, onPress: () => alert('Ask me later pressed')},
        {text: 'Cancel', onPress: () => alert('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: false }
    )
  }

  getFcm = async () => {
    console.log('fcm method called')
    messaging()
    .getToken()
    .then(token => {
      console.log('Rambabu', token)
      this.setState({token:token});
      AsyncStorage.setItem('fcmToken',token);
     return this.saveTokenToDatabase(token);
    });
    
  }
   
  saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const userId = auth().currentUser.uid;
    console.log('userId', userId);
    // Add the token to the users datastore
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      });
  }
  agree_Tnc = async () => {

    let token = null;
    const secureId = await AsyncStorage.getItem('secureId')

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      console.log(finalStatus, 89)
      // token = await Notifications.getExpoPushTokenAsync(); 
      // console.log(token,81);
      try {
        console.log('before token');
        const deviceToken = await AsyncStorage.getItem('fcmToken')
        if(deviceToken !=null){
          console.log('fetching the deviceToken from local storage')
          this.setState({token:deviceToken})
        }else {
          console.log('gets the devices token from firebase');
          let fcm = this.getFcm();
          console.log('rambabu fcm',fcm);
        }
        // token = await Notifications.getExpoPushTokenAsync();
        // let config = {gcmSenderId:"vona-a1037"}
        // token = await Notifications.getDevicePushTokenAsync(config);
        // this._showAlert(token);
        // console.log('GCM Token:', token, 'rambabu');
      } catch (err) {
        console.log('token error block');

        // alert("Error", err)
        // this._showAlert(err);
        console.log("Error", err);
      }
      // this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }
    if (this.state.token == null) {
      this.setState({
        loading: true
      })
    }

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
      let SelUrl = await AsyncStorage.getItem('url');
      let body = JSON.stringify({
        VONAId: this.state.VONAId,
        pmId: this.state.pmId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        heading: location.coords.heading,
        altitude: location.coords.altitude,
        speed: location.coords.speed,
        VONAInviteCode: secureId,
        deviceToken: this.state.token
      });

      if(this.state.token != null){
      await apiCall(SelUrl + Url.API.TERMS_CONDITIONS, 'post', body)
        .then((responseJson) => {
          if (responseJson.Valid) {
            this.setState({
              loading: false
            })
            AsyncStorage.setItem('TC', JSON.stringify(responseJson), () => { });
            this.props.navigation.navigate('Active');
          } else {
            console.log(responseJson, 'DEVICE TOKEN');
          }
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.props.navigation.navigate('HomeScreen');
      }
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
    alignSelf: 'center',
    color:'black'
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