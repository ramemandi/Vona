import { AsyncStorage } from "react-native";
import Url from '../components/Urls';

export const getTabsData = (offset, threatType) => {
  return new Promise(async (resolve, reject) => {
    // console.log('data from manager js'let );
    let VONAId = null;
    let localData = await AsyncStorage.getItem('loginData', (error, result) => {
      if (error) {
        return
      } else {
        // console.log(result, 'vALUE')
        let d = JSON.parse(result);
        // console.log(d.Item.VONAId,'--------------------------')
        if (d !== null) {
          VONAId = d.Item.VONAId;
        }
      }
    });
    // console.log(`http://devapi.tracktechllc.com/tracktech/api/pmaccountprofile/GetVONAHistoryStatus?vonaId=${VONAId}&startDate=null&endDate=null&appStatus=${threatType}&pageSize=10&skip=${offset}`);

    await fetch(Url.API.VONA_HISTORY+`vonaId=${VONAId}&startDate=null&endDate=null&appStatus=${threatType}&pageSize=10&skip=${offset}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length > 0) {
          resolve(responseJson)
        } else {
          resolve([])
        }
      })
      .catch(error => {
        reject(error)
      });
  });
};


 