
// import * as React from 'react';
// import { createAppContainer, StackNavigator, createDrawerNavigator } from 'react-navigation';
// import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// import { createStackNavigator } from 'react-navigation-stack';
// // // You can import from local files
// import Welcome from '../components/Welcome';
// import Home from '../components/Home';
// import FourQuarts from '../components/FourQuarts';
// import NoThreats from '../components/NoThreats';
// import ActiveThreats from '../components/ActiveThreats';
// import Danger from '../components/Danger';
// import CurrentLocation from '../components/Location';
// import TermsAndConditions from '../components/TermsAndConditions';
//   import Lazyload from '../components/Lazyload';
// const Tab_2 = createMaterialTopTabNavigator({
//     NoThreats: {
//       screen: NoThreats,
//       navigationOptions: {
//         tabBarLabel: "No Threats",
//         showIcon: true,
//         tabBarIcon: ({ tintColor }) => (
//           <Image style={{ width: 35, height: 35, padding: 0 }} source={require('./assets/danger.png')} />
//         )
//       },
//     },
//     Active: {
//       screen: ActiveThreats,
//     },
//     Danger: {
//       screen: Danger,
//     }
//   }, {
//     tabBarPosition: 'top',
//     swipeEnabled: true,
//     tabBarOptions: {
//       activeTintColor: '#fff',
//       pressColor: '#004D40',
//       inactiveTintColor: '#fff',
//       upperCaseLabel: false,
//       style: {
//         backgroundColor: '#0061a7',
//       },
  
//       labelStyle: {
//         fontSize: 16,
//         fontWeight: '200',
  
//       }
//     }
  
//   });
  
//   const appStackNavigator = createStackNavigator({
//     Active: FourQuarts,
//     CurrentLocation: CurrentLocation,
//     Terms: TermsAndConditions,
//     Tabs: Tab_2,
//     Lazyload: Lazyload,
//    });
 
//   const appStackNavigator1 = createStackNavigator({
//     Welcome: Welcome,
//     Active: FourQuarts,
//     CurrentLocation: CurrentLocation,
//     Terms: TermsAndConditions,
//     Tabs: Tab_2,
//     Lazyload: Lazyload,
//    });
//   const testContainer = createStackNavigator({
//     HomeScreen: Home,
//     appStackNavigator1
//   }, { headerMode: "none" })  
  
// //   export const AppContainer = createAppContainer(appStackNavigator);
//   // const AppContainer1 = createAppContainer(appStackNavigator1);
//  const AppContainer1 = createAppContainer(testContainer);
//  export default AppContainer1;