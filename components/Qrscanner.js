import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import {   BarCodeScanner, Permissions } from 'expo';
import * as Constants from 'expo-constants';
export default class App extends Component {
  state = {
    hasCameraPermission: null
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = data => {
    Alert.alert(
      'Scan successful!',
      JSON.stringify(data)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <BarCodeScanner
            onBarCodeScanned={this._handleBarCodeRead}
              style={{ height: 200, width: 200 }}
            />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  }
});

// import React, { Component } from 'react';
// import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity,AsyncStorage } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import * as Permissions from 'expo-permissions';
 
// export default class QRscanner extends Component {
//   state = {
//     hasCameraPermission: null,
//     lastScannedUrl: null,
//     previousScandata: false
//   };

//   componentDidMount() {
//     this._requestCameraPermission();
//     AsyncStorage.clear();
//   }

//   _requestCameraPermission = async () => {
//     const { status } = await Permissions.askAsync(Permissions.CAMERA);
//     this.setState({
//       hasCameraPermission: status === 'granted',
//     });
//   };

//   _handleBarCodeRead = result => {
//         console.log(result.data,'Barcodeed data');        
//      if (result.data !== this.state.lastScannedUrl) {
//       LayoutAnimation.spring();
//       this.setState({ lastScannedUrl: result.data });
//     } else {
//        AsyncStorage.getItem('QR_DATA',(error,results)=>{
//       console.log(JSON.parse(results),'storage data');
//      console.log(result.data)
//       if(result.data == JSON.parse(results)){
//          console.log(result.data,'qrdata-> if worked')
//           this.setState({previousScandata:true});
//           // this._maybeRenderUrl();
//       }
//     })
//     }
     
//   };

//   render() {
//     return (
//       <View style={styles.container}>

//         {this.state.hasCameraPermission === null
//           ? <Text>Requesting for camera permission</Text>
//           : this.state.hasCameraPermission === false
//               ? <Text style={{ color: '#fff' }}>
//                   Camera permission is not granted
//                 </Text>
//               : <BarCodeScanner
//                   onBarCodeRead={this._handleBarCodeRead}
//                   style={{
//                     // height: Dimensions.get('window').height,
//                     // width: Dimensions.get('window').width,
//                  height: "50%",
//                     width: "80%",
//                   }}
//                 />}

//         {this._maybeRenderUrl()}

//         <StatusBar hidden />
//       </View>
//     );
//   }

//   _handlePressUrl = () => {
//       Alert.alert(
//       'Open this URL?',
//       this.state.lastScannedUrl,
//       [
//         {
//           text: 'Save',
//           // onPress: () => Linking.openURL(this.state.lastScannedUrl),
//           onPress: () => {this._saveQR_Data('save')},

//         },
//         { text: 'Cancel', onPress: () => {this._handlePressCancel()} },
//       ],
//       { cancellable: false }
//     )
//   };
  
//   _handlePressCancel = () => {
     
//     AsyncStorage.getItem('QR_DATA',(error,results)=>{
//       console.log(results,'storage data')
//     })
  
//     // this.setState({ previousScandata: this.state.lastScannedUrl });
//     this.setState({ lastScannedUrl: null });

//   };

// _saveQR_Data = (type) => {
//   if(type ==='save'){
//  AsyncStorage.setItem('QR_DATA', JSON.stringify(this.state.lastScannedUrl), () => {
//    this.setState({previousScandata:true})
// });
//   } 
    
//   };

//   _maybeRenderUrl = () => {
//     if (!this.state.lastScannedUrl) {
//         return;
//     }

//     return (
//        <View style={styles.bottomBar}>
//        {(this.state.previousScandata)?
//        <View>
//         <Text>This QR Code was already scanned...Please try another</Text>
//        </View>: this._handlePressUrl()
//        }
//        </View>
         
      
    
//       // <View style={styles.bottomBar}>
//       //   <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
//       //     <Text numberOfLines={1} style={styles.urlText}>
//       //       {this.state.lastScannedUrl}
//       //     </Text>
//       //   </TouchableOpacity>
//       //   <TouchableOpacity
//       //     style={styles.cancelButton}
//       //     onPress={this._handlePressCancel}>
//       //     <Text style={styles.cancelButtonText}>
//       //       Cancel
//       //     </Text>
//       //   </TouchableOpacity>
//       // </View>
//     );
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#000',
//    }
//    ,
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 15,
//     flexDirection: 'row',
//   },
//   // url: {
//   //   flex: 1,
//   // },
//   // urlText: {
//   //   color: '#fff',
//   //   fontSize: 20,
//   // },
//   // cancelButton: {
//   //   marginLeft: 10,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
//   // cancelButtonText: {
//   //   color: 'rgba(255,255,255,0.8)',
//   //   fontSize: 18,
//   // },
// });