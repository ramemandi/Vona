import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,StatusBar
} from 'react-native';
 
const HomeLoading=()=> {
      // Render any loading content that you like here
      return (
        <View style={[styles.container,styles.horizontal]}>
          <ActivityIndicator size="large" />
        </View>
      );
    
  }
   const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop:'50%'
      }
  });

  export default HomeLoading;


// import * as React from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   ActivityIndicator,StatusBar
// } from 'react-native';
 
// class  HomeLoading extends React.Component {
//     constructor() {
//       super();
//     }
//     // Render any loading content that you like here
//     render() {
//       return (
//         <View style={[styles.container,styles.horizontal]}>
//           <ActivityIndicator size="large" />
         
//         </View>
//       );
//     }
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     horizontal: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginTop:'50%'
//       }
//   });

//   export default HomeLoading;