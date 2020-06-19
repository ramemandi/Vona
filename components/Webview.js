import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import * as  Constants  from 'expo-constants';
import { WebView } from 'react-native-webview';


export default class WebViewPage extends React.Component {

    state = {
        showWebView: false,
        url:null
    }
    constructor(props){
        super(props)
    }
    componentDidMount(){
        console.log(this.props.navigation.state.params.url,'ddddd');
       this.setState({url: this.props.navigation.state.params.url})
    }
 
   

    render() {
        return (
            <WebView
            source={{
                uri: this.state.url,
            }}
             
            startInLoadingState
            scalesPageToFit
            javaScriptEnabled
            style={{ flex: 1 }}
        />
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
    },
});