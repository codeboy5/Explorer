/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */

import React, { Component } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  View,
  PermissionsAndroid
} from "react-native";

import wifi from "react-native-android-wifi";

// type Props = {};
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWifiNetworkEnabled: null,
      ssid: null,
      pass: null,
      ssidExist: null,
      currentSSID: null,
      currentBSSID: null,
      wifiList: null,
      modalVisible: false,
      status: null,
      level: null,
      ip: null
    };
  }

  componentDidMount() {
    console.log(wifi);
    this.askForUserPermissions();
  }

  async askForUserPermissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Wifi networks",
          message: "We need your permission in order to find wifi networks"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
      } else {
        console.log(
          "You will not able to retrieve wifi available networks list"
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getWifiNetworksOnPress() {
    wifi.reScanAndLoadWifiList(
      wifiStringList => {
        console.log(wifiStringList);
        var wifiArray = JSON.parse(wifiStringList);
        this.setState({
          wifiList: wifiArray,
          modalVisible: true
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  renderModal() {
    var wifiListComponents = [];
    for (w in this.state.wifiList) {
      wifiListComponents.push(
        <View key={w} style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>
            {this.state.wifiList[w].SSID}
          </Text>
          <Text>BSSID: {this.state.wifiList[w].BSSID}</Text>
          <Text>Capabilities: {this.state.wifiList[w].capabilities}</Text>
          <Text>Frequency: {this.state.wifiList[w].frequency}</Text>
          <Text>Level: {this.state.wifiList[w].level}</Text>
          <Text>Timestamp: {this.state.wifiList[w].timestamp}</Text>
        </View>
      );
    }
    return wifiListComponents;
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Explorer App</Text>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Get all wifi networks in range
            </Text>
            <TouchableHighlight
              style={styles.bigButton}
              onPress={this.getWifiNetworksOnPress.bind(this)}
            >
              <Text style={styles.buttonText}>Available WIFI Networks</Text>
            </TouchableHighlight>
          </View>
        </View>
        <Modal visible={this.state.modalVisible} onRequestClose={() => {}}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this.setState({ modalVisible: false })}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableHighlight>
          <ScrollView>{this.renderModal()}</ScrollView>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5FCFF",
    marginBottom: 100,
    justifyContent: "center"
  },
  row: {
    flexDirection: "row"
  },
  title: {
    fontSize: 20
  },
  instructionsContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC"
  },
  instructionsTitle: {
    marginBottom: 10,
    color: "#333333"
  },
  instructions: {
    color: "#333333"
  },
  button: {
    padding: 5,
    width: 120,
    alignItems: "center",
    backgroundColor: "blue",
    marginRight: 15
  },
  bigButton: {
    padding: 5,
    width: 180,
    alignItems: "center",
    backgroundColor: "blue",
    marginRight: 15
  },
  buttonText: {
    color: "white"
  },
  answer: {
    marginTop: 5
  }
});
