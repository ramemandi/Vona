import React from 'react';
import { AsyncStorage, Text, View, StyleSheet, WebView } from 'react-native';
import { Card } from 'react-native-elements';
import Url from '../components/Urls';
import { apiCall } from '../components/FourQuarts.Service';
import { Button } from 'react-native-elements';
export default class Resources extends React.Component {
    state = {
        resources: null
    }
    constructor(props) {
        super(props);
        this.state = {
            resources: []
        }
    }
    componentDidMount() {
        this.getResourses_Types();
    }
    getResourses_Types = async () => {
        // Kiran api
        const value = await AsyncStorage.getItem('loginData');
        let d = JSON.parse(value);
        let SelUrl = await AsyncStorage.getItem('url');
        await apiCall(SelUrl+Url.API.GET_RESOURES + 'agencyId=' + d.Item.agencyId, 'get', null).then((response) => {
         console.log(response.Item.resources, 'Response');
            if (response.Valid) {
                let addStatus = response.Item.resources.map((el) => ({ ...el, status: false }))
                this.setState({ resources: addStatus });
                // console.log(this.state.resources, 'eelee')
            } else {
                this.setState({ resources: [] })
            }
        }).catch(error => {
            console.log(error);
        });
    }
    loadWebView = (url) => {
        this.props.navigation.navigate('webView', { url: url })
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.showWebView && this.renderContent()}
                <Button
                    style={styles.paragraph}
                    title="Login"
                    onPress={() => this.setState({ showWebView: true })}
                />
            </View>
        );
    }
    render() {

        return (
            <View>

                {
                    this.state.resources.map((url, index) => {
                        return (
                            <Card title={url.featureName} key={index.toString()}>
                                    {/* <Text style={{ marginBottom: 10 }}>
                                        The idea with React Native Elements is more about component structure than actual design.
                                    </Text> */}

                                <Button
                                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                    title='VIEW NOW'
                                    onPress={() => this.loadWebView(url.webviewUrl)}
                                />
                            </Card>)
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        backgroundColor: '#ecf0f1',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
});