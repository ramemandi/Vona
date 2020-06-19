//This is an example of React Native 
//FlatList Pagination to Load More Data dynamically - Infinite List
import React, { Component } from 'react';
//import react in our code.

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator, AsyncStorage
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Url from '../components/Urls';
import { apiCall } from '../components/FourQuarts.Service';
class Lazyload extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.state = {
      loading: true,
      //Loading state used while loading the data for the first time
      serverData: [],
      //Data Source for the FlatList
      fetching_from_server: false,
      vonaId: this.props.navigation.state.params.vonaId
      //Loading state used while loading more data
    };
    this.offset = 1;
    //Index of the offset to load from web API   
  }

  componentDidMount = async () => {
    let SelUrl = await AsyncStorage.getItem('url');
    await apiCall(SelUrl + Url.API.VONA_HISTORY + `vonaId=${this.state.vonaId}&startDate=null&endDate=null&appStatus=noActiveThreats&pageSize=10&skip=${this.offset}`, 'get', null)
      .then(responseJson => {
        //  console.log("responseJson : ", responseJson.length);
        //    responseJson = responseJson.slice((this.offset*12),((this.offset+1)*12)-1)
        //              console.log("offset : "+this.offset);
        responseJson = responseJson;
        //  console.log(responseJson.slice((this.offset*12),((this.offset+1)*12)-1));
        //Successful response from the API Call 
        this.offset = this.offset + 1;
        //After the response increasing the offset for the next API call.
        this.setState({
          // serverData: [...this.state.serverData, ...responseJson.results],
          serverData: [...this.state.serverData, ...responseJson],
          //adding the new data with old one available in Data Source of the List
          loading: false,
          //updating the loading state to false
        });
      })
      .catch(error => {
        console.log(error);
      });
    // this.loadMoreData()
  }

  loadMoreData = async () => {
    //On click of Load More button We will call the web API again
    let SelUrl = await AsyncStorage.getItem('url');
    this.setState({ fetching_from_server: true }, async () => {

      // await fetch(SelUrl + Url.API.VONA_HISTORY + `vonaId=${this.state.vonaId}&startDate=null&endDate=null&appStatus=noActiveThreats&pageSize=10&skip=${this.offset}`, {
      //   method: 'GET',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   }
      // }).then(response => response.json())
      await apiCall(SelUrl + Url.API.VONA_HISTORY + `vonaId=${this.state.vonaId}&startDate=null&endDate=null&appStatus=noActiveThreats&pageSize=10&skip=${this.offset}`, 'get', null)
        .then(responseJson => {
          //    responseJson = responseJson.slice((this.offset*12),((this.offset+1)*12)-1)
          //     console.log("offset Load : "+this.offset);
          responseJson = responseJson;
          // console.log(responseJson);
          //Successful response from the API Call 
          if (responseJson.length > 0) {
            this.offset = this.offset + 1;
            //After the response increasing the offset for the next API call.
            this.setState({
              //serverData: [...this.state.serverData, ...responseJson.results],
              serverData: [...this.state.serverData, ...responseJson],
              fetching_from_server: false,
              //updating the loading state to false
            });
          }

        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  renderFooter() {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.loadMoreData}
          //On Click of button calling loadMoreData function to load more data
          style={styles.loadMoreBtn, { backgroundColor: (this.state.serverData.length <= 8) ? '#FFFFFF' : '#800000' }}>
          {(this.state.serverData.length <= 8) ? null : (<Text style={styles.btnText}>Loading </Text>)}

          {this.state.serverData.length > 8 ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
          {(this.state.serverData.length <= 0) && (<Text style={styles.btnText}> No Data </Text>)}

        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator size="large" />
        ) : (
            <FlatList
              style={{ width: '100%' }}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.serverData}
              renderItem={({ item, index }) => (
                <ListItem 
                  leftAvatar
                  title={item.address}
                  subtitle={<View style={styles.subtitle}>
                  <Text>{item.VONAUserDateTime}</Text>
                  </View>}
                />

              )}
              onEndReached={this.loadMoreData}
              onEndReachedThreshold={0.1}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListFooterComponent={this.renderFooter.bind(this)}
            //Adding Load More button as footer component
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  item: {
    padding: 10, height: 80
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  subtitle:{
    color:'black'
  }
});
export default Lazyload;
