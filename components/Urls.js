import { AsyncStorage } from 'react-native';
export const urlSelection = (value) => {
    // http://demo-api.tracktechllc.com/api/PMAccountProfile/VerifyVONARandomCode?code=GDB3DB
    // await fetch('http://devapi.tracktechllc.com/tracktech/api/PMAccountProfile/VerifyVONARandomCode?code=' + secureId, {
    console.log(value, 'VALUEEE')
    return new Promise(async (resolve, reject) => {
        // console.log('data from manager js');
        let url = null;
        if (value) {
            if (value.toLocaleLowerCase().search('dev') === 0) {
                url = 'http://devapi.tracktechllc.com/tracktech/';
                let result = await selectedUrl(url)
                // console.log(result,'dvev api')
                if (result) {
                    return resolve(url)
                } else {
                    reject(result)
                }
            } else if (value.toLocaleLowerCase().search('demo') === 0) {
                url = ' https://demo-api.tracktechllc.com/';  
                let result =  await selectedUrl(url)
                if (result) {
                    return resolve(url)
                } else {
                    reject(result)
                }

            } else if (value.toLocaleLowerCase().search('beta') === 0) {
                url = 'https://beta-api.tracktechllc.com/';
                let result =  await selectedUrl(url)
                if (result) {
                    return resolve(url)
                } else {
                    reject(result)
                }
            } else {
                url = 'http://devapi.tracktechllc.com/tracktech/';
                // url = https://api.tracktechllc.com/
                let result =  await selectedUrl(url)
                if (result) {
                    return resolve(url)
                } else {
                    reject(result)
                }
            }
        } else {
            reject(value)
        }

    });
};

export const selectedUrl = async (url) => {
    // console.log(url,'selectedUrl');
let urls = AsyncStorage.setItem('url',url);
 return true;
}


export default class Url {
        //  that = this;
    // url = 'https://beta-api.tracktechllc.com/';
    //  static url = 'http://devapi.tracktechllc.com/tracktech/';
    //  static url = 'https://beta-api.tracktechllc.com/';
    // static currentUrl;
    // constructor(){
        // that.currentUrl = (async()=>{await(AsyncStorage.getItem('url'))?this.url = await AsyncStorage.getItem('url'):this.url='http://test/com';})
 
    // }
    
    
    static API = {
        LOGIN: 'api/PMAccountProfile/VerifyVONARandomCode?',
        GET_RESOURES: 'api/PMAccountProfile/GetVONAConfiguration?',
        TERMS_CONDITIONS: 'api/PMAccountProfile/AcceptVONATC',
        PANIC: 'api/PMAccountProfile/LogVONAMemberStatus',
        VONA_HISTORY: 'api/pmaccountprofile/GetVONAHistoryStatus?',
        VONA_MEMBER_STATUS: 'api/PMAccountProfile/LogVONAMemberStatus'
    }
}



