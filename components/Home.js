import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  AsyncStorage, Platform, Alert, Linking, Dimensions, LayoutAnimation,
  StatusBar, TouchableOpacity, Keyboard, KeyboardAvoidingView, 
} from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
// import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import * as Location from 'expo-location';
import { urlSelection } from '../components/Urls';
import Url from '../components/Urls';
import { apiCall } from '../components/FourQuarts.Service';
import { isSignedIn } from './Auth';
import { connect } from 'react-redux';
import * as FileSystem from 'expo-file-system';
 
const keyboardVerticalOffset = Platform.OS === 'ios' ? 10 : 8

class Home extends React.Component {
  static navigationOptions = {
    title: null,
    headerLeft: null
  };
  state = {
    location: null,
    errorMessage: null,
    hasCameraPermission: null,
    lastScannedUrl: null,
    previousScandata: false,
    requestedQr: false,
    qrValue: null,
    secureId: null,
    type:"http://temp.com",
    uri:null
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMsg: false,
    };
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    // this.setState({ location });
  };
  validate = async () => {

    let url = null;
    const { secureId } = this.state;
    await urlSelection(secureId).then(async (res) => {
    console.log('url type', res)
      if (res) {
        url = res;
        await AsyncStorage.setItem('url', res);
        this.setState({ secureId: this.state.secureId.substr(secureId.length - 6) });
      }
    }).catch((err) => { console.log(err) });

    if (this.state.secureId.length >= 6) {
       let SelUrl = await AsyncStorage.getItem('url');
      await apiCall(SelUrl+ Url.API.LOGIN + 'code=' + this.state.secureId, 'get', null).then(async(response) => {
         console.log('working IN', response);
        if (response.Valid) {
            // console.log(response,'LOGIN response')
          AsyncStorage.setItem('loginData', JSON.stringify(response), () => { });
          AsyncStorage.setItem('secureId', this.state.secureId, () => { });
          this.setState({
            errorMsg: false
          });
         try {
         await FileSystem.downloadAsync(
          response.Item.agencyIconUrl,
            FileSystem.documentDirectory + 'small.jpg'
          ) .then(({ uri }) => {
              // console.log('Finished downloading to ', uri);
              iconTestPath=FileSystem.documentDirectory + 'small.jpg';
              // console.log(iconTestPath);
              // console.log({uri:iconTestPath});
              this.setState({uri:iconTestPath});
              // console.log(Boolean({iconTestPath}.exists));
            })
            .catch(error => {
              console.error(error);
          });
        } catch (error) {
          console.error(error);
        }
        this.props.navigation.navigate('Welcome', { icon: this.state.uri });
          // this.props.navigation.dispatch(navigateAction)
        } else {
     //     console.log('working');  
          this.setState({
            errorMsg: true,
          });
        } 
      }).catch(error => {
        console.log(error);
      });
     }
    else {
      this.setState({
        errorMsg: true,
      });
      alert('Please valid 6 digit');
    }
  }; 
  renderMsg() {
    if (!this.state.errorMsg) {
      return (
        <Text style={styles.paragraph}>
          {'\n'}
          {'\n'}Your secure code is provided {'\n'}
          to you by your Officer.{'\n'}
          Contact them if you need{'\n'}
          further assistance.

        </Text>
      );
    } else {
      return (
        <Text style={[styles.paragraph, { color: "red" }]}>
          Unable to verify your code. Check {'\n'}
          your code and try again. {'\n'}
          CODE: ERR21718 {'\n'}
          Contact your officer for futher {'\n'}
          instructions
        </Text>
      );
    }
  }

  componentDidMount =async ()=>{  
    try {
      await isSignedIn().then((res) => {
    //   console.log(res, 'dddddddd')
       if(res){
    //    console.log(res, 'dddddddd')
         this.props.navigation.navigate("Active");
       }       
      }).catch((err) => { console.log(err,'custome error') })
    } catch (error) {
      console.log(error)
    }
        
  }
 
  _requestCameraPermission = async () => {
     const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // console.log(status, ' status');
    console.log(this.state.requestedQr, ' requestedQr ');
    this.setState({
      hasCameraPermission: status === 'granted',
      requestedQr: !this.state.requestedQr
    });
  };

  _handleBarCodeRead = result => {
    // console.log(result, ' result');
    // console.log(this.state.lastScannedUrl, ' lastScannedUrl');
    // console.log(this.state.previousScandata, ' this.state.previousScandata');
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data, secureId: result.data });
      // console.log(this.state.secureId, ' this.state.previousScandata');
      this.validate(this.state.secureId)
    } else {

      AsyncStorage.getItem('QR_DATA', (error, results) => {
        console.log(JSON.parse(results), '_handleBarCodeRead');
        console.log(result.data)
        if (result.data === JSON.parse(results)) {
          // console.log(result.data, 'qrdata-> if worked')
          this.setState({ previousScandata: true });
          // this._maybeRenderUrl();  
        }
      })
      this.validate()
    }

  };


  _handlePressUrl = () => {
    Alert.alert(
      'Open this URL?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Save',
          // onPress: () => Linking.openURL(this.state.lastScannedUrl),
          onPress: () => { this._saveQR_Data('save') },

        },
        { text: 'Cancel', onPress: () => { this._handlePressCancel() } },
      ],
      { cancellable: false }
    )
  };

  _handlePressCancel = () => {

    AsyncStorage.getItem('QR_DATA', (error, results) => {
      // console.log(results, 'storage data')
    })

    // this.setState({ previousScandata: this.state.lastScannedUrl }); 
    this.setState({ lastScannedUrl: null });

  };

  _saveQR_Data = (type) => {
    if (type === 'save') {
      AsyncStorage.setItem('QR_DATA', JSON.stringify(this.state.lastScannedUrl), () => {
        this.setState({ previousScandata: true })
      });
    }

  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        {this.state.previousScandata &&
          <View>
            <Text>This QR Code was already scanned...Please try another</Text>
          </View>
        }
      </View>
     );
  };


  render() {
    return (
      <View style={styles.container}>
             <Image   source={require('../assets/tracktech1.png')} />
        <Text style={styles.paragraph}>
          {'\n'} ENTER YOUR SECURE CODE {'\n'}BELOW TO GET
          {'\n'}STARTED
        </Text>
        <KeyboardAvoidingView behavior="position" enabled="true" keyboardVerticalOffset={keyboardVerticalOffset}>
          <TextInput
            style={styles.TextInputStyle}
            placeholder="Secure ID"
            onChangeText={secureId => this.setState({ secureId })}
            onBlur={e => this.validate()}
            //  onBlur={() => navigate('Welcome', {name: 'Jane'})}
            maxLength={12}
            value={this.state.secureId}
            autoCapitalize="characters"
          />
        </KeyboardAvoidingView>

        <View style={{ width: 100, height: 50 }}>
          <Button
            onPress={() => this._requestCameraPermission()}
            title={!this.state.requestedQr ? ' SCAN QR ' : 'CLOSE QR'}
            color="#0061a7"
            accessibilityLabel="This btn will read barcode"
          />
        </View>
        {this.state.requestedQr === true
          && (
            <BarCodeScanner
              onBarCodeScanned={this._handleBarCodeRead}
              style={{
                height: "45%",
                width: "100%",
              }}
            />
          )}
        {this._maybeRenderUrl()}
        {this.renderMsg()}
      </View>
    );
  }

}
// const mapStatetoProps = (state) => {
//   console.log(JSON.stringify(state), 'state at cart btn')
//   return {
//     reducer: state
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//    console.log(dispatch,'dispatch')  
//   return {
//     addItemToCart: (product) => dispatch({ type: 'updateType', payload: product })
//   }
// }
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    flex: 1
  },
  paragraph: {
    margin: 28,
    marginTop: 0,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 75,
    width: 100,
  },
  TextInputStyle: {
    textAlign: 'center',
    height: 35,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0061a7',
    // #009688
    marginBottom: 10,
    fontSize: 16,
    width: 200,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
});

export default Home;