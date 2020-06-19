import React, { Component } from "react";
import { Alert, Platform } from "react-native";
import { NetInfo } from "react-native-netinfo";
 
export const CheckConnectivity = () => {
    // For Android devices
    if (Platform.OS === "android") {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          // Alert.alert("You are online!");
        } else {
          // Alert.alert("You are offline!");
        }
      });
    } else {
      // For iOS devices
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
      );
    }
  };

  handleFirstConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
      // Alert.alert("You are offline!"); 
    } else {
      // Alert.alert("You are online!");
    }
  };
 
  