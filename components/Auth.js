import { AsyncStorage } from "react-native";
import ActiveThreats from '../components/ActiveThreats';
import Danger from '../components/Danger';
import * as React from 'react';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
 
export const LOCATION_TASK = 'background-location';
export const myAction = () => {
  console.log('myAction from manager js');
  const nav = NavigationActions.navigate({
   action: NavigationActions.navigate({ routeName: 'Danger' })
  });
  // this.props.navigation.dispatch(nav);
  console.log(nav,'NAV')
  return nav;
};
export const USER_KEY = "auth-demo-key";

export const onSignOut = () => AsyncStorage.removeItem('userId');

export const isSignedIn = () => {
 
  return new Promise( async(resolve, reject) => {
    // console.log('data from manager js');
    await AsyncStorage.getItem('loginData')
      .then(res => {
        let data = JSON.parse(res);
        // console.log(data,'terms and condition   accepted') 
        if (data) {
          let termsAceeptedOrNot = data.Item.isTCAccepted;
          if(termsAceeptedOrNot){
            resolve(true)
          }else {
            reject(false);  
          }
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
export const getUserData=()=>{
  return new Promise( async(resolve, reject) => {
    // console.log('data from manager js');
    await AsyncStorage.getItem('loginData')
      .then(res => {
          if (res !== null) {
          resolve(res);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
}

 