import * as React from 'react';

import { Text, View, Image, StyleSheet,AppRegistry, AsyncStorage,AppState, DeviceEventEmitter } from 'react-native';
import { Constants } from 'expo';
import { createStackNavigator, createAppContainer,StackNavigator,createMaterialTopTabNavigator,createDrawerNavigator } from 'react-navigation';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import { FontAwesome } from '@expo/vector-icons';
export default class AssetExample extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Local files and assets can be imported by dragging and dropping them into the editor
        </Text>
         <FontAwesome name="check" size={100} backgroundColor="#3b5998"  >
            </FontAwesome>
        <Image style={styles.logo} source={require('../assets/snack-icon.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 128,
    width: 128,
  }
});
