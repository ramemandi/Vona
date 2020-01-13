import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { getTabsData } from './Api';
import {styles} from './TabStyles';
// import ThreeAxisSensor from 'expo-sensors/build/ThreeAxisSensor';

class ActiveThreats extends React.Component {
  // static navigationOptions = ({ navigation, screenProps }) => ({
  //   //  headerLeft: <BackTitle />,
  //   headerRight: <Text style={{marginRight:10}}>Welcome {navigation.state.params.name}</Text>,
  //   headerTitle:(<Image style={{width:35, height: 35, alignItems: 'flex-start',padding:0}} resizeMode="contain" source={require('../assets/Colorado.jpg')}/>
  //   ),
  //   title: <HeaderTitle />
  // });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      serverData: [],
      fetching_from_server: false,
      tempData: [],
      animating: true
    };
    this.offset = 1;
  }
  componentDidMount = async () => {
    this.closeActivityIndicator()
    await this.get_ActiveThreats();
  }

  get_ActiveThreats() {
    getTabsData(this.offset, 'activeThreats')
      .then(async (responseJson) => {
        responseJson = responseJson;
        this.setState({
          tempData: responseJson
        })
        this.offset = this.offset + 1;
        this.setState({
          serverData: [...this.state.serverData, ...responseJson],
          loading: false,
        });
      }).catch(err => alert('An error occurred'));
  }
  closeActivityIndicator = () => setTimeout(() => this.setState({
    animating: false
  }), 5000)
  renderFooter() {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        {(this.state.tempData.length > 0) ? (
          <TouchableOpacity  
            activeOpacity={0.9}
            onPress={this.loadMoreData}
            //On Click of button calling loadMoreData function to load more data
            style={styles.loadMoreBtn}>
            <Text style={styles.btnText}>Loading</Text>
            {this.state.fetching_from_server ? (
              <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        ) : (
            <View> 
              {((this.state.animating) || (this.state.serverData.length > 0)) ? (<ActivityIndicator animating={this.state.animating} color="red" style={{ marginLeft: 8 }} />) : <Text style={{ alignSelf: "center", fontSize: 16 }}>No Datya</Text>}
            </View>
          )}
      </View>
    );
  }
  separator() {
    return (
      <Text style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1 }} />
    );
  }
  loadMoreData = async () => {
    this.setState({ fetching_from_server: true }, async () => {
      await this.get_ActiveThreats()
    });
  };
  render() {
    // this.setState(this.state.data);
    let date = new Date();
    return (
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',

          }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Image
              style={styles.logo}
              source={require('../assets/attention.png')}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ textAlign: 'center' }}>Active Threats </Text>
        </View>

        <FlatList
          style={{ width: '100%' }}
          data={this.state.serverData}
          renderItem={({ item, index }) => (
            <ListItem
              leftAvatar
              title={item.latitude + ' - ' + item.longitude}
              subtitle={item.VONAUserDateTime}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.loadMoreData}
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={this.renderFooter.bind(this)}
        //Adding Load More button as footer component
        />
        {/* <View style={{ flex: 1}}>
          
        <Footer style={{ position:'absolute'}}/>
        </View> */}
      </View>
    );
  }
}

export default ActiveThreats;
