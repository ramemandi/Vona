import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Constants from 'expo-constants';
// import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as _ from 'lodash';
export default class MapViews extends React.Component {

  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    isLoading: true,
    markers: [],
    boundries: []
  };
  tempLocation = null;
  constructor(props) {
    super(props);
    // this.state = {
    //   isLoading: true,
    //   markers: [],
    // };
  }
  componentDidMount() {
    Promise.all(
      [this.getLocationAsync().then((location) => {
        // console.log(location, 'locat');
        this.setState({ locationResult: JSON.stringify(location.loc) });
        this.setState({ mapRegion: { latitude: location.loc.coords.latitude, longitude: location.loc.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } });
        this.fetchMarkerData(location.loc.coords.latitude, location.loc.coords.longitude).then((nearByplaces) => {
          this.setState({
            isLoading: false,
            markers: nearByplaces.map((item) => { return { location: item.geometry.location, name: item.name } }),
            boundries: nearByplaces.map((item) => { return { latitude: item.geometry.location.lat, longitude: item.geometry.location.lng } })
          });
          console.log(this.state.boundries, 'Bounderis')
        }).catch((err) => {
          console.log(err, 'eerror message')
        })
      }).catch(err => {
        console.log(err, 'erroind')
      })
      ])
  }

  handleMapRegionChange(mapRegion) {
    // console.log(mapRegion, 'mapRegion');
    this.setState({ mapRegion });
    // this.setState({})
  }

  async getLocationAsync() {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Location.getCurrentPositionAsync({});

    this.tempLocation = location;
    console.log(location, 'loollo')
    return { loc: location };
    // this.tempLocation = location;
    // this.setState({ locationResult: JSON.stringify(location) }); 
    // this.setState({ mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } });

    // console.log(location, 'Location');


    // let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // if (status !== 'granted') {
    //   this.setState({
    //     locationResult: 'Permission to access location was denied',
    //   });
    // } else {
    //   this.setState({ hasLocationPermissions: true });
    // }

    // let location = await Location.getCurrentPositionAsync({});
    // this.setState({ locationResult: JSON.stringify(location) });
    // console.log(location,'Location');
    // this.setState({ mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } });
  }
  // async fetchMarkerData(lat, lng) {
  //   return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&types=hospital&sensor=true&key=AIzaSyDfYcLWG86Q9RiOAtZE4ANFmJatlN5hrB4`)
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       // console.log(responseJson.results.length, 'GOOGLE MAPS DATA');
  //       return responseJson.results;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  async fetchMarkerData(lat, lng) {
    let temp = []
    let places = ['hospital', 'bank', 'police'];
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      let result = await this.getNearByPlaces(lat, lng, place);
      if (result && result.length) {
        temp.push(result)
      }
      console.log('3 places from google maps', temp.length)
      // console.log('3 places from google maps',temp)
    }
    return _.flattenDeep(temp);

  }
  async getNearByPlaces(lat, lng, place) {
    let temp;
    return new Promise((resolve, reject) => {
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&types=${place}&sensor=true&key=AIzaSyDfYcLWG86Q9RiOAtZE4ANFmJatlN5hrB4`)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson.results.length, 'GOOGLE MAPS DATA');
          temp = responseJson.results;
          console.log(temp.slice(0, 1), 'dddddddddd')
          if (temp && temp.length > 0) {
            resolve(temp)
          } else {
            reject([])
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Please wait...
        </Text>

        {this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
              <Text>Map region doesn't exist.</Text> :
              this.state.markers.length === 0 ? null :
                <MapView
                  ref={ref => {
                    this.map = ref;
                  }}
                  style={styles.mapStyle}
                  region={this.state.mapRegion}
                  onRegionChangeComplete={(event) => this.handleMapRegionChange(event)}
                  zoomEnabled={true}
                  maxZoomLevel={20}
                  minZoomLevel={8}
                  onLayout={() => this.map.fitToCoordinates(this.state.boundries, { edgePadding: { top: 50, right: 10, bottom: 10, left: 10 }, animated: false })}
                >
                  {this.state.isLoading ? null : this.state.markers.map((marker, index) => {
                    const coords = {
                      latitude: marker.location.lat,
                      longitude: marker.location.lng,
                    };

                    const metadata = `Status: ${marker.name}`;

                    return (
                      <MapView.Marker
                        key={index}
                        coordinate={coords}
                        title={marker.name}
                        description={metadata}

                      />

                    );
                  })}
                  {/* {(this.state.boundries.length > 2) && (

                    <Polyline
                      coordinates={this.state.boundries}
                      strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                      strokeColors={[
                        '#7F0000',
                        '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                        '#B24112',
                        '#E5845C',
                        '#238C23',
                        '#7F0000'
                      ]}
                      strokeWidth={6}
                    />


                  )} */}
                </MapView>
        }

        {/* <Text>
          Location: {this.state.locationResult}
        </Text> */}
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    paddingTop: Constants.statusBarHeight,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});


// import React from 'react';
// import MapView from 'react-native-maps';
// import { StyleSheet, Text, View, Dimensions } from 'react-native';

// export default class MapViews extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <MapView style={styles.mapStyle} />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   mapStyle: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
// });