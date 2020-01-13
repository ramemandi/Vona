import * as React from 'react';
// import firebase from 'firebase';
import { AsyncStorage, Alert, Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStackNavigator, createAppContainer, StackNavigator } from 'react-navigation';
import { Button } from 'react-native';
import Footer from './Foot';
import { Notifications, Permissions, AppLoading } from 'expo';
import HomeLoading from './Home_loading';
import { getUserData } from './Auth';
import LoadImage from './Image'
class Welcome extends React.Component {
  static navigationOptions = {
    header: null
  };
  image = null;

  // async _loadAssetsAsync() {
  //   const imageAssets = cacheImages([
  //     'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  //     require('./assets/images/circle.jpg'),
  //   ]);

  //   const fontAssets = cacheFonts([FontAwesome.font]);

  //   await Promise.all([...imageAssets, ...fontAssets]);
  // }
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params.icon, 'from Login home page');
    // this._loadAssetsAsync();11
    this.state = {
      displayName: null,
      agencyIcon: null,
      loading: true,
      loaded: false,
      uri: null,
      image: (<Image source={{ uri: this.props.navigation.state.params.icon }} style={style.logo} onLoad={this.imageLoaded}
        resizeMode="cover" />),
    }

  }

  componentDidMount = async () => {
    this.setState({ agencyIcon: this.props.navigation.state.params.icon });
    try {
      await getUserData().then((res) => {
        let d = JSON.parse(res);
        this.setState({
          displayName: d.Item.firstName,
          loading: false
        })
      }).catch((err) => { console.log(err) })
    } catch (error) {
      console.log(error)
    }
  }

  imageLoaded = () => {
    this.setState({ loaded: true })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}>
        {((!this.state.image && !this.state.loaded)) ? (<HomeLoading />) :
          <View style={[style.parent]}>
            <View style={[style.child]}>
              <Image style={style.logo}
                source={require('../assets/logo_device.png')}
                resizeMode="cover" />
            </View>

            <View style={[style.child]}>
              <LoadImage source={{ uri: this.props.navigation.state.params.icon, width: 90, height: 90, cache: 'force-cache' }} />
              {/* {this.state.image} */}
              {/* <Image
                  style={style.logo}  
                  source={{ uri: this.state.agencyIcon }}
                  onLoad={this.imageLoaded}
                  resizeMode="cover"
                /> */}
            </View>
            <View style={[style.child], { width: '100%', alignSelf: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: "center" }} >
                Welcome {this.state.displayName}
                {'\n'}
                {'\n'}
              </Text>
              <Image style={{ alignSelf: "center" }} source={require('../assets/green.jpg')} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: "center" }}>{'\n'}{'\n'}{'\n'}To continue press start
               {'\n'}{'\n'}
              </Text>
              <View style={{ width: 100, height: 50, alignSelf: "center" }}>
                <Button
                  onPress={() => navigate('Terms', { name: this.state.displayName, icon: this.state.agencyIcon })} title=" START "
                  color="#00BFFF"
                  accessibilityLabel="Learn more about this purple button"
                />
              </View>
            </View>
            <View>
              <Footer /></View>
          </View>
        }
      </View>
    );

  }
}

const style = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    //  paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },
  child: {
    width: '48%',
    margin: '1%',
    aspectRatio: 1,
    // padding: '9%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    height: 120,
    width: 120,
  },

  paragraph: {
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  }

});
export default Welcome;

// import * as React from 'react';
// // import firebase from 'firebase';
// import { AsyncStorage,Alert,Text, View, StyleSheet, Image, TouchableOpacity ,ActivityIndicator } from 'react-native';
// import { createStackNavigator, createAppContainer,StackNavigator } from 'react-navigation';
// import { Button } from 'react-native';
// import Footer from './Foot';
// import {Notifications, Permissions} from 'expo';
// import  HomeLoading  from './Home_loading';
// // Initialize Firebase
// // const firebaseConfig = {
// // apiKey:"AIzaSyA8Fabx1XtDKkHyDcIwqnv5PRCHd4EhWxU", //"<YOUR-API-KEY>",
// // // authDomain:"https://vona-react-6ba1f.firebaseapp.com",//"vona-fcb2a.firebaseapp.com", //"<YOUR-AUTH-DOMAIN>",
// //  databaseURL: "https://vona-react-6ba1f.firebaseio.com/",

// // //"<YOUR-DATABASE-URL>",
// // //storageBucket: "vona-fcb2a.appspot.com"//"<YOUR-STORAGE-BUCKET>"
// // }
// // import { Button } from 'react-native-elements';
// class Welcome extends React.Component {
// //   static navigationOptions = {
// //     title: 'AssetPage',
// //     headerTitle: (
// //       <Image source={require('../assets/tick.png')}/>
// //   ),
// //  };
//   constructor(props) {
//     super(props);
//     this.state ={
//       displayName : null,
//       agencyIcon:null,
//       loading:true
//     }
//     // if (!firebase.apps.length) {
//     // firebase.initializeApp(firebaseConfig);
//     // }
//   }  
//   componentDidMount= async() =>{
//     // console.log(AsyncStorage.getItem('VONAId'),'Vona id')
// //     const { status: existingStatus } = await Permissions.getAsync(
// //     Permissions.NOTIFICATIONS
// //   );
// //   let finalStatus = existingStatus;
// // // debugger;
// //   // only ask if permissions have not already been determined, because
// //   // iOS won't necessarily prompt the user a second time.
// //   if (existingStatus !== 'granted') {
// //     // Android remote notification permissions are granted during the app
// //     // install, so this will only ask on iOS
// //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
// //     finalStatus = status;
// //   }

// //   // Stop here if the user did not grant permissions
// //   if (finalStatus !== 'granted') {
// //     alert(finalStatus);
// //     return;
// //   }

// //   // Get the token that uniquely identifies this device
// //   let token = await Notifications.getExpoPushTokenAsync();
// //   console.log(token,'KIRAN ');
// //   try{
// //   let time = new Date()
// //   var updates = {};
// //   const secureId = await AsyncStorage.getItem('secureId')
// //         updates['token'] = {'expoToken': token,'lastUpdate':time.getTime()}; 
// //         // let d =  firebase.database().ref("users").update(updates);
// //         let d =   firebase.database().ref('/tokens/'+secureId).set({'token':token})
// //         //  let d = await firebase.database().ref("users").set(updates);
// //         console.log(d,'test') 
// //   }catch(error)
// //   {
// //     console.log(error, "61 welcome.js")
// //   }
//   try {
//   const value = await AsyncStorage.getItem('loginData')
//   if (value !== null) {
//      setTimeout(()=>{
//       let d = JSON.parse(value);
//       // console.log(d.Item, 'vALUE Item- 76');
//     this.setState({
//       displayName:d.Item.firstName,
//       agencyIcon:d.Item.agencyIconUrl,
//       loading:false
//     })
//       },2000)
//   }
// } catch (e) {
//   console.error('No data', e)  
// }  
//   }
//    _onPressButton() {
//     Alert.alert('You tapped the button!');
//      this.props.navigation.navigate('Active')
//      }
//   }


// }
