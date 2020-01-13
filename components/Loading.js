// import * as React from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   ActivityIndicator, StatusBar
// } from 'react-native';
// import { isSignedIn } from '../components/Auth';
// export const LoadingScreen = () => {
//   // this.state = {
//   //   signedIn: false,
//   //   checkedSignIn: false,
//   // };.
//   // _bootstrapAsync();
//   //  return  render();.
//   let signedIn = null;
//   let checkedSignIn;
//   isSignedIn()
//     .then(async (res) => {
//       // this.setState({ signedIn: res, checkedSignIn: true });
//       if (!res) {
//         return (<View style={{
//           flex: 1,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//           <ActivityIndicator />
//           <StatusBar barStyle="default" />
//         </View>)
//       }

//       signedIn = res;
//       checkedSignIn = true;
//       // console.log(res, 'res');
//       // console.log(this.state.signedIn, 'signedIn');
//       if (signedIn) {
//         this.props.navigation.navigate('Active', { signedIn: true });
//         return true;
//       } else {
//         this.props.navigation.navigate('HomeScreen', { signedIn: false });
//         return true;
//       }
//     })
//     .catch(err => { });

// }

// // Fetch the token from storage then navigate to our appropriate place
// // const _bootstrapAsync = async () => {
//   //   const userToken = await AsyncStorage.getItem('userToken');
//   // This will switch to the App screen or Auth screen and this loading
//   // screen will be unmounted and thrown away.


//   // Render any loading content that you like here
//   // export const render = () => {
//   //   return (
//   //     <View style={styles.container}>
//   //       <ActivityIndicator />
//   //       <StatusBar barStyle="default" />
//   //     </View>
//   //   );
//   // }


//   // const styles = StyleSheet.create({
//   //   container: {
//   //     flex: 1,
//   //     alignItems: 'center',
//   //     justifyContent: 'center',
//   //   },
//   // });

//   // export default LoadingScreen;



import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,StatusBar
} from 'react-native';
import { isSignedIn } from '../components/Auth';
class  LoadingScreen extends React.Component {
    constructor() {
      super();
      this.state = {
        signedIn: false,
        checkedSignIn: false,
      };
      this._bootstrapAsync();
    }


    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
    //   const userToken = await AsyncStorage.getItem('userToken');
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      isSignedIn()
      .then( async (res) => {
        this.setState({ signedIn: res, checkedSignIn: true });
        // console.log(res, 'res');
        // console.log(this.state.signedIn, 'signedIn');
       this.props.navigation.navigate(this.state.signedIn ? 'Active' : 'HomeScreen');  
      })
      .catch(err => {});
    };

    // Render any loading content that you like here
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  export default LoadingScreen;