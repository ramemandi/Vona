import React, { Component } from "react";
import { TextInput, View, Text, StyleSheet, Image } from "react-native";

class LoadImage extends React.Component {
    constructor(props) {
        console.log(props)
        super(props)
    }

    render() {
        return (
            <View>
                <Image {...this.props} resizeMode="cover" /></View>
        )
    };
}
export default LoadImage;
// import * as React from 'react';


// const HomeLoading=()=> {
//       // Render any loading content that you like here
//       return (
//         <View style={[styles.container,styles.horizontal]}>
//           <ActivityIndicator size="large" />
//         </View>
//       );

//   }
//    const styles = StyleSheet.create({
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