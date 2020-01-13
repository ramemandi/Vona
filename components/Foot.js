import React, { Component } from 'react';
import {  Text,  View,  StyleSheet ,} from 'react-native';

 class Footer extends Component {
  
  render() {
   let year = new Date().getFullYear();
    return (
        <View style={style.bottomView}>
          <Text>Ver 1.7 @ TRACKtech {year}</Text>
        </View>
    );
  }
}
 
 
 export default Footer;

// export default DangerButton;
const style = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 25,
    backgroundColor: '#0061a7',
    justifyContent: 'center',
    alignItems: 'center',
     bottom: 0,
     position:'absolute'
  },
});
 
// export default Footer