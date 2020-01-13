import React, { Component } from "react";
import { View, TouchableOpacity, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import  {withNavigation} from 'react-navigation'
import { State } from "react-native-gesture-handler";
// const ShoppingCartIcon = (props) => (

const CartButton = (props) => {
    console.log(props,'redux props')
  return true
}
 
const mapStatetoProps = (state) => {
    console.log(JSON.stringify(state),'state at cart btn')
        return {
            curtItems: state
        }
    }
    

export default connect(mapStatetoProps)(CartButton);