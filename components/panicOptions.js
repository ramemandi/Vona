// import * as React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { RadioButton } from 'react-native-paper';

// class PanicOptions extends React.Component {
//     state = {
//         checked: 'first',
//     };
//     constructor() {
//         super()
//     }
//     componentDidMount() {

//     }
//     render() {
//         return (
//             <View style={styles.container}>
//                 <View style={{flexDirection:"row"}}>
//                 <Text>1.I need to speak with officer</Text>
//                  <RadioButton
//                     value="first"
//                     status={checked === 'first' ? 'checked' : 'unchecked'}
//                     onPress={() => { this.setState({ checked: 'first' }); }}
//                 />
//                 </View>
//             </View>
//         )
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
//     },
//     textStyles: {
//         fontSize: 16
//     }
// })
// export default PanicOptions;

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



//This is an example of React Native 
//FlatList Pagination to Load More Data dynamically - Infinite List
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Button } from 'react-native-elements';

// import { List, ListItem } from 'react-native-elements';
class PanicOptions extends React.Component {
    state = {
        checked: 'first',
        //Data Source for the FlatList
        fetching_from_server: false,
        //Loading state used while loading more data
        options: [{ opt: 1, selected: "unchecked", value:"I want to connect with a Counselor"}, { opt: 2, selected: "unchecked",value:"I need help finding a shelter" }, { opt: 3, selected: "checked",value:"I want to connect with a substance abuse relief specialist" },
        { opt: 4, selected: "unchecked",value:"I need help with an emotional issue" }]
    };
    constructor() {
        super();

    }

    componentDidMount = async () => {
        //fetch('http://aboutreact.com/demo/getpost.php?offset=' + this.offset)
        // await fetch(`http://devapi.tracktechllc.com/tracktech/api/pmaccountprofile/GetVONAHistoryStatus?vonaId=e52be235-77d4-411c-ab35-d811d0cdd1d4&startDate=null&endDate=null&appStatus=noActiveThreats&pageSize=10&skip=${this.offset}`, {
        //     method: 'GET',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     }
        // }).then(response => response.json())
        //     .then(responseJson => {
        //         responseJson = responseJson;
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    }
    UpdateRadio(option) {
        // console.log(option, 'Selected OPtions')
        let options = [...this.state.options];
        //  options  = [...options, {selected: "unchecked"}];
        options = options.map((p) => (p.opt) ? { ...p, selected: 'unchecked' } : p);
        // console.log(options, 'changed OPtions')
        let index = options.findIndex(x => x.opt === option.opt)
        // console.log(index, 'Index');
        options[index] = { ...options[index], selected: "checked" };
        this.setState({ options });
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}>
                    {this.state.options.map((option, index) => {
                        return (
                            <View style={{ flexDirection: "row", width: "100%", paddingBottom:5 }} key={index}>
                                {/* <Text style={{ fontSize: 18 }}>{index+1}.I need to speak with officer</Text> */}
                                {/* {(index == 0) && (<View style={{ width: '70%' }}><Text style={{ fontSize: 18 }}>{index + 1}.I need to speak with officer</Text></View>)} */}
                                {/* {(index == 1) && (<View style={{ width: '70%' }}><Text style={{ fontSize: 18 }}>{index + 1}.Option - {index + 1}</Text></View>)}
                                {(index == 2) && (<View style={{ width: '70%' }}><Text style={{ fontSize: 18 }}>{index + 1}.Option - {index + 1}</Text></View>)}
                                <View style={{ width: '25%' }}> */}
                                <View style={{ width: '90%' }}><Text style={{ fontSize: 18 }}>{option.value} </Text></View>
                                <View style={{ width: '10%' }}>
                                    <RadioButton
                                        value="first"
                                        status={option.selected}
                                        onPress={() => this.UpdateRadio(option)}
                                    /></View>
                            </View>
                        )
                    })}
                    <View style={{marginTop:'20%'}}>
                        <Button buttonStyle={{ borderRadius: 6, marginRight: 7, width: 200 }} title="Submit" />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
export default PanicOptions;

