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

//  const value = AsyncStorage.getItem('loginData');
//  var USER_KEY1=null;
//   if (value !== null) {
//     console.log(value, 'vALUE')
//       let d = JSON.parse(value);
//       USER_KEY1 = d.Item.pmId;
//     // console.log(d.Item, 'vALUE Item');  
//   }
// export const onSignIn = () => AsyncStorage.setItem('userId', USER_KEY1);

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
    console.log('data from manager js');
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
// export const callTaskManager = () => {
//   return new Promise((resolve, reject) => {
//      AsyncStorage.getItem('loginData')
//       .then(res => {
//         if (res !== null) {
//           //  onPress()
//           resolve(true);
//         } else {
//           resolve(false);
//         }
//       })
//       .catch(err => reject(err));
//   });

// };
// export const onPress =  async () => {
//     await Permissions.askAsync(Permissions.LOCATION);
//     let DD= null;
//       DD =  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
//       timeInterval: 60000,
//       distanceInterval: 0,
//       accuracy: Location.Accuracy.High,
//     });
//   };
// TaskManager.defineTask(LOCATION_TASK, async({ data, error }) => {
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     return;
//   }
//   if (data) {
//     console.log(data,'data from auths')
//     var dateTime = new Date();
//     dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
//     let vonaid=null;
//     let pmId= null;
//     let vonaUserType = null;
//     try {
//           const value = await AsyncStorage.getItem('loginData');
//           if (value !== null) {
//               let d = JSON.parse(value);
//               vonaid = d.Item.VONAId,
//               pmId = d.Item.pmId,
//               vonaUserType = d.Item.VONAUserType
//           }
//     } catch (e) {
//           console.error('No data', e)
//     } 
//   const { currentLocation } = data.locations;
//   //  console.log(data.locations[0].coords.latitude, 'locationsss data');
//     // console.log(currentLocation[0], 'latitude data');
//   let dd = data.locations;
//   const secureId = await AsyncStorage.getItem('secureId')
//  await fetch('http://devapi.tracktechllc.com/tracktech/api/PMAccountProfile/LogVONAMemberStatus', {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     VONAId: vonaid,
//     pmId:pmId,
//     VONAUserType: vonaUserType,
//       // latitude:data.locations[0].coords.latitude,
//       // longitude:data.locations[0].coords.longitude,
//      latitude:39.9937402,
//      longitude:-105.2709766,
//     accuracy:data.locations[0].coords.accuracy,
//     heading:data.locations[0].coords.heading,
//     altitude:data.locations[0].coords.altitude,
//     speed:data.locations[0].coords.speed,
//     status:null,
//     VONAInviteCode: secureId,
//     VONAUserDateTime:dateTime
//   })
// }).then(response => response.json())
//         .then(responseJson => {
//           console.log(responseJson.Item.currentAppStatus , 'Auth 124');
//           AsyncStorage.setItem('alertType', responseJson.Item.currentAppStatus, ()           => {});
//           return {status:true};
//           })
//         .catch(error => {
//           console.error(error);
//         });

//   }
// });
 