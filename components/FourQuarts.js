import * as React from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity, Platform, AsyncStorage, ActivityIndicator, StatusBar, BackHandler, Modal,
  Linking
} from 'react-native';
// import { Constants, Location, Permissions, TaskManager } from 'expo';
import * as Location from 'expo-location';
import { NavigationActions } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import * as Constants from 'expo-constants';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
const LOCATION_TASK_NAME = 'background-location-tasks';
import HomeLoading from './Home_loading';
import Url from '../components/Urls';
import { apiCall } from '../components/FourQuarts.Service';
// import AppContainer1 from '../App'
import { Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import store from '../components/store/index'
import { Notifications } from 'expo';

class FourQuarts extends React.Component {
  static navigationOptions = {
    title: null,
    headerLeft: null,
  };
  _notificationSubscription;
  constructor(props) {
    super(props);
    // SelUrl=null;
    this.state = {
      nothreats: true,
      attention: false,
      danger: false,
      VONAId: null,
      pmId: null,
      errorMessage: null,
      time: null,
      AlertIconType: null,
      displayname: null,
      panicAlert: false,
      safetyPlaces: null,
      agencyIcon: null,
      type: '',
      height: null

    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    // console.log(this.state.type ,'@50')
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    // console.log('back button')
    this.props.navigation.goBack(null);
    return true;
  }
  componentDidMount = async () => {
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'active' })],
    // });
    // this.props.navigation.dispatch(resetAction);

    // this.props.navigation.replace('home')


    let SelUrl = await AsyncStorage.getItem('url');
    this.setState({ SelUrl: SelUrl })
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    this.interval = setInterval(async () => {
      // let dd = store.getState().type;  

      // this.setState({type:dd})
      let Icon = await AsyncStorage.getItem('alertType');
      let update = JSON.parse(Icon);
      let updateAlert = null;
      let updateMessage = null;
      if (update) {
        (update.alertType) ? updateAlert = update.alertType : updateAlert = '';
        (update.message) ? updateMessage = update.message : updateMessage = '';
      }
      this.updateThreatsIcon(updateAlert, updateMessage);
    }, 1000);

    await Permissions.askAsync(Permissions.LOCATION);
    this.onCalled();
    this.getResourses_Types();
    this.getAppData();
  }

  _handleNotification = (notification) => {
    console.log(notification, 'notification')
    this.onCalled();
    this.getResourses_Types();
    this.getAppData();
  };
  getAppData = async () => {
    let CODE = null;
    await (AsyncStorage.getItem('secureId', (error, secureId) => {
      // console.log(error, '--error', secureId);
      if (error) {
        this.props.navigation.navigate('HomeScreen');
      } else {
        CODE = secureId
      }
    }));
    try {
      let SelUrl = await AsyncStorage.getItem('url');
      await apiCall(SelUrl + Url.API.LOGIN + 'code=' + CODE, 'get', null).then(async (response) => {
        // console.log('working IN', response);
        if (response.Valid) {
          AsyncStorage.setItem('loginData', JSON.stringify(response), () => { });
          AsyncStorage.setItem('secureId', CODE, () => { });
          const value = await AsyncStorage.getItem('loginData')
          let d = JSON.parse(value);
          if (d !== null) {
            // console.log(d.Item.pmId, 'vALUE')
            setTimeout(() => {
              this.setState({
                VONAId: d.Item.VONAId,
                pmId: d.Item.pmId,
                VONAUserType: d.Item.VONAUserType,
                displayname: d.Item.firstName,
                agencyIcon: d.Item.agencyIconUrl
              })
            }, 3000)
          }
          const valueTC = await AsyncStorage.getItem('TC')
          if (valueTC !== null) {
            let tc = JSON.parse(valueTC);
            console.log(tc.Item.currentAppStatus, 'tc.Item.currentAppStatus');
            // this.updateThreatsIcon(tc.Item.currentAppStatus);
          }

        } else {
          // console.log('working');
          this.setState({
            errorMsg: true,
          });
        }
      }).catch(error => {
        console.log(error);
      });
    } catch (e) {
      console.log('No data', e)
    }
  };
  updateThreatsIcon(threatType, type) {
    //console.log(threatType,'++++++++++++++++ 163');
    //console.log(type,'++++++++++++++++ 164');

    switch (threatType) {
      case 'noActiveThreats': this.setState({ nothreats: true, attention: false, danger: false, type: type });
        break;
      case 'activeThreats': this.setState({ nothreats: false, attention: true, danger: false, type: type })
        break;
      case 'danger': this.setState({ nothreats: false, attention: false, danger: true, type: type })
        break;
      default: this.setState({ nothreats: true, attention: false, danger: false, type: type })
        break;
    }
  }
  callFun = () => {
    this.props.navigation.navigate('Lazyload', { vonaId: this.state.VONAId });
  };
  callFun1 = () => {
    this.props.navigation.navigate('Lazyload', { name: this.state.displayname });
  };
  gotoTabs = () => {
    // this.props.navigation.navigate('Tabs', { name: this.state.displayname });
    this.props.navigation.navigate('resources');

  };

  sendPanic = () => {
    this.setState({ panicAlert: true })
    // Alert.alert(
    //   'Are you sure you want to send a PANIC "alert"?',
    //   this.state.lastScannedUrl,
    //   [
    //     {
    //       text: 'Yes',
    //       onPress: () => { this.savePanic() },
    //     },
    //     { text: 'No', onPress: () => { } },
    //   ],
    //   { cancellable: false }
    // )
    return (<View>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={true}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={style.modalBackground}>
          <View style={style.activityIndicatorWrapper}>
            <Text>Weleocme to panic</Text>
          </View>
        </View>
      </Modal>
    </View>)
  };
  savePanic = async () => {
    let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
    // console.log(location,'PANIC',)

    // fetch('http://devapi.tracktechllc.com/tracktech/api/PMAccountProfile/LogVONAMemberStatus', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     VONAId: this.state.VONAId,
    //     pmId: this.state.pmId,
    //     VONAUserType: this.state.VONAUserType,
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //     accuracy: location.coords.accuracy,
    //     heading: location.coords.heading,
    //     altitude: location.coords.altitude,
    //     speed: location.coords.speed,
    //     status: 'PANIC'
    //   }),
    // }).then(response => response.json())
    let data = JSON.stringify({
      VONAId: this.state.VONAId,
      pmId: this.state.pmId,
      VONAUserType: this.state.VONAUserType,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      heading: location.coords.heading,
      altitude: location.coords.altitude,
      speed: location.coords.speed,
      status: 'PANIC'
    })
    let SelUrl = await AsyncStorage.getItem('url');
    await apiCall(SelUrl + Url.API.PANIC, 'post', data)
      .then((responseJson) => {
        // console.log(responseJson, 'responseJson');
      })
      .catch(error => {
        console.log(error);
      });
    Alert.alert('Panic request sent successfully');
    // }
  }

  onCalled = async () => {
    console.log('onCalled -263');

    let DD = null;
    DD = await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      timeInterval: 60000,
      distanceInterval: 0,
      deferredUpdatesInterval: 0,
      deferredUpdatesDistance: 0,
      accuracy: Location.Accuracy.BestForNavigation,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Vona Running',
        notificationBody: 'Alert ! Vona frequently accessing your location.',
        notificationColor: '#FFA07A'
      }
    }).then(async (res) => {
      console.log(res, 'RETURNS FORM APP JS .')
    });
  };
  OpenWithPhoneApp = () => {
    this.setState({ panicAlert: false })
    Linking.openURL('tel:911');
  }

  loader() {
    if (!this.state.VONAId) {
      return true;
    }
    return null;
  }

  panicOptionsPage = () => {
    this.setState({ panicAlert: false })
    this.props.navigation.navigate('panic');
  }


  getResourses_Types = async () => {
    // Kiran api
    let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const value = await AsyncStorage.getItem('loginData');
    let d = JSON.parse(value);
    let SelUrl = await AsyncStorage.getItem('url');
    await apiCall(SelUrl + Url.API.GET_RESOURES + 'agencyId=' + d.Item.agencyId, 'get', null).then((response) => {
      // console.log(response.Item.safetyPlaceTypes)
      if (response.Valid) {
        this.setState({ safetyPlaces: response.Item.safetyPlaceTypes })
      } else {
        this.setState({ safetyPlaces: [] })
      }
    }).catch(error => {
      console.log(error);
    });
  }

  async fetchMarkerData(lat, lng, types) {
    let temp = []
    // ['hospital', 'bank', 'police']
    let places = types;
    console.log(typeof (types), 'types type')
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      let result = await this.getNearByPlaces(lat, lng, place);
      if (result && result.length) {
        temp.push(result)
      }
      console.log('3 places from google maps', temp.length)
      // console.log('3 places from google maps',temp)
    }
    return _.flattenDeep(temp);

  }
  async getNearByPlaces(lat, lng, place) {
    let temp;
    return new Promise((resolve, reject) => {
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&types=${place}&sensor=true&key=AIzaSyDfYcLWG86Q9RiOAtZE4ANFmJatlN5hrB4`)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson.results.length, 'GOOGLE MAPS DATA');
          temp = responseJson.results;
          console.log(temp.slice(0, 1), 'dddddddddd')
          if (temp && temp.length > 0) {
            resolve(temp)
          } else {
            reject([])
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
  }

  get_LatandLang = async () => {
    // this.props.navigation.navigate('CurrentLocation');
    ///latitude: location.coords.latitude,
    ///longitude: location.coords.longitude,
    // this.props.navigation.navigate('MapView');
    let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
    console.log(this.state.safetyPlaces, 'SAFETY PLACES')
    let place = this.state.safetyPlaces.join(",");
    console.log(place, 'SAFETY PLACES')
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${location.coords.latitude},${location.coords.longitude}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    // Linking.openURL(url);   
    Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + place);
    // Linking.openURL();
    // Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=Pike+Place+Market+Seattle+WA&travelmode=bicycling`);
  };
  changeLayout = async (event) => {
    let { height } = event.nativeEvent.layout
    this.setState({ height: height });
  }
  render() {
    let d = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    let year = new Date().getFullYear()
    return (
      <View >
        {(this.loader() != null) ? (<HomeLoading />) : (
          <View style={[style.parent]}>
            <View
              style={{ width: '50%', paddingLeft: '3%', alignItems: 'flex-start' }}>
              <TouchableOpacity activeOpacity={0.5}>
                <Image
                  style={style.logo2}
                  // source={require('../assets/Colorado.jpg')} 
                  source={{ uri: this.state.agencyIcon, width: 20, height: 20 }}

                />
              </TouchableOpacity>
            </View>
            <View
              style={{ width: '50%', paddingRight: '3%', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16 }}>Welcome {this.state.displayname}</Text>
            </View>

            <View style={{ width: '100%', marginTop: 25 }}>

            </View>

            <View onLayout={(event) => {
              this.changeLayout(event)
            }} style={[style.innerBlocks, { borderRightColor: 'lightgrey', borderRightWidth: 2, paddingBottom: 35 }]}>
              {this.state.nothreats === true && (
                <TouchableOpacity activeOpacity={0.5} onPress={this.callFun}  >
                  {/* <FontAwesome name="check" size={100} backgroundColor="#3b5998"  >
                  </FontAwesome> */}
                  <Image
                    style={{ width: 100, height: 90 }}
                    source={require('../assets/nothreat.png')}
                  // source={require('../assets/danger_exit.png')}  
                  // source={require('../assets/alert.png')}                   
                  />
                </TouchableOpacity>

              )}
              {this.state.nothreats === true && (
                <View>
                  <Text style={{ textAlign: "center", alignSelf: "center", fontSize: 16, fontWeight: "bold" }}>{this.state.type}</Text>
                </View>
              )}
              {this.state.attention === true && (
                <TouchableOpacity activeOpacity={0.5} onPress={this.callFun} >
                  <Image
                    style={{ width: 100, height: 90 }}
                    source={require('../assets/alert.png')}
                  />
                  {/* <FontAwesome name="exclamation-triangle" size={100} backgroundColor="#3b5998"  >
                  </FontAwesome> */}
                </TouchableOpacity>
              )}
              {this.state.attention === true && (
                <View >
                  <Text style={{ textAlign: "center", alignSelf: "center", fontSize: 16, fontWeight: "bold" }}>{this.state.type}</Text>
                </View>
              )}
              {this.state.danger === true && (
                <TouchableOpacity activeOpacity={0.5} onPress={this.callFun}  >

                  <Image
                    style={{ width: 100, height: 90 }}
                    source={require('../assets/danger_exit.png')}
                  />
                  {/* <FontAwesome name="exclamation-triangle" size={100} backgroundColor="#3b5998"  >
                  </FontAwesome> */}
                </TouchableOpacity>
              )}
              {this.state.danger === true && (
                <View>
                  <Text style={{ textAlign: "center", alignSelf: "center", fontSize: 16, fontWeight: "bold" }}>{this.state.type}</Text>
                </View>
              )}
              <Text style={{ alignSelf: "center", fontSize: 10, fontWeight: "bold", marginTop: '8%' }}>{d}</Text>
            </View>

            <View style={[style.innerBlocks, { height: this.state.height, borderLeftColor: 'lightgrey', borderLeftWidth: 2, paddingBottom: 35 }]}>
              <TouchableOpacity activeOpacity={0.5} onPress={this.get_LatandLang}>

                {/* <FontAwesome name="sliders" size={100} backgroundColor="#3b5998"  >
                </FontAwesome> */}
                <View style={{ alignItems: "center" }}>
                  {/* <FontAwesome name="map-marker" size={100} backgroundColor="#3b5998"   >
                  </FontAwesome> */}
                  <MaterialIcons name="directions-run" size={100} backgroundColor="#3b5998">
                  </MaterialIcons>
                  <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: "bold" }}>Safe Routes</Text>

                </View>
                {/* {this.state.attention === true ?
                  (<Text style={{ alignSelf: "center", fontSize: 10, fontWeight: "bold" }} >Hi, Warning Threat Triggered...Click to get Exit Routes</Text>)
                  : this.state.danger === true ? (<Text style={{ alignSelf: "center", fontSize: 10, fontWeight: "bold" }} >Hi, Danger Threat Triggered...Click to get Exit Routes</Text>)
                    : <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: "bold" }}>MapView</Text>} */}
              </TouchableOpacity>

            </View>
            <View
              style={{
                borderTopColor: 'lightgrey',
                borderTopWidth: 4,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Image
                style={style.logo1}
                source={require('../assets/tt3.jpg')}
                // source={require('../assets/logo_device.png')}
                resizeMode="cover"
              />
            </View>

            <View style={[style.innerBlocks, { borderRightColor: 'lightgrey', borderRightWidth: 2 }]}>
              <TouchableOpacity activeOpacity={0.5} onPress={this.gotoTabs}>
                {/* <Image source={require('../assets/history.png')} style={{ width: 70, height: 70 }} /> */}
                <FontAwesome name="life-buoy" size={100} backgroundColor="#3b5998"  >
                </FontAwesome>
                <Text style={{ fontSize: 16, fontWeight: "bold", alignSelf: "center" }}>Life Resources</Text>
              </TouchableOpacity>
            </View>

            <View style={[style.innerBlocks, { borderLeftColor: 'lightgrey', borderLeftWidth: 2 }]}>
              <TouchableOpacity activeOpacity={0.5} onPress={this.sendPanic}>
                {/* <Image  source={require('../assets/panic.jpg')} style={{ width: 70, height: 70 }} /> */}
                <FontAwesome name="question" size={100} backgroundColor="#3b5998"  >
                </FontAwesome>
                <Text style={{ fontSize: 16, alignSelf: "center", fontWeight: "bold" }}>Panic</Text>
                <Modal
                  transparent={true}
                  animationType={'none'}
                  visible={this.state.panicAlert}
                  onRequestClose={() => { this.setState({ panicAlert: null }) }}>
                  <View style={style.modalBackground}>
                    <View style={style.modelContent}>
                      <View style={{ backgroundColor: "0061a7", color: "#fff", paddingTop: 8, paddingLeft: 8 }}>
                        {/* <Text>Panic Message</Text> */}
                      </View>
                      <View style={{ padding: 12 }}>
                        <Text numberOfLines={4}> If you need immediate assistance and facing a life threatening situation, please call 911.
                      </Text>
                        <Text>{'\n'} Would you like to call 911? </Text>
                      </View>
                      <View style={{ flexDirection: "row", paddingBottom: 10, paddingRight: 10, alignItems: "flex-end", alignSelf: "flex-end" }}>
                        <Button buttonStyle={{ borderRadius: 6, marginRight: 7, width: 75 }} title="Yes" onPress={this.OpenWithPhoneApp} />
                        <Button buttonStyle={{ borderRadius: 6, width: 75 }} title="No" onPress={this.panicOptionsPage} />
                      </View>
                    </View>
                  </View>
                </Modal>
              </TouchableOpacity>
            </View>
            <View style={style.bottomView}>
              <Text style={{ color: "#fff" }}>Ver 1.7 @ TRACKtech {year}</Text>
            </View>
          </View>

        )}

      </View>
    );
  }
}
// const mapStatetoProps = (state) => {
//   console.log(JSON.stringify(state), '@Fourquarts')
//   // this.setState({type:state.type})
//   return {
//     type: state
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//   console.log(dispatch,'dispatch mapDispatchToProps')  
//  return {
//    addItemToCart: (product) => dispatch({ type: 'updateType', payload: product })
//  }
// }
const style = StyleSheet.create({
  parent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '1%',
    // backgroundColor:"#589ADC",
    height: '100%',
    // backgroundColor: '#ecf0f1'
  },

  innerBlocks: {
    flexDirection: 'column', width: '50%', alignItems: 'center',
    justifyContent: 'center', height: 'auto', padding: 25
  },
  logo: {
    height: 70,
    width: 70,
  },
  logo1: {
    height: 60,
    width: 75,
    marginTop: '-6%',
  },
  logo2: {
    height: 50,
    width: 50,
  },
  bottomView: {
    width: '100%',
    height: 30,
    backgroundColor: '#0061a7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  modelContent: {
    backgroundColor: '#FFFFFF',
    height: '35%',
    width: '90%',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-around'
  }

});

export default FourQuarts;