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
import {
  magnetometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.magnetometer, 500);

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
      ip: null,
      magnetometer: null,
      magModalVisible: false
    };
    this.subscription = null;
    this.handler = "Hello";
  }

  componentDidMount() {
    this.askForUserPermissions();
  }

  async askForUserPermissions() {
    try {
      const granted = await Promise.all([
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Wifi networks",
            message: "We need your permission in order to find wifi networks"
          }
        ),
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Write Files",
            message: "We need your permission in order to write files"
          }
        )
      ]);
      console.log(granted);
    } catch (err) {
      console.warn(err);
    }
  }

  convertArrayOfObjectsToCSV = args => {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ",";
    lineDelimiter = args.lineDelimiter || "\n";

    keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  };

  writeToFile = () => {
    var csv = convertArrayOfObjectsToCSV({
      data: this.state.wifiList
    });
  };

  // async askForUserPermissions() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: "Wifi networks",
  //         message: "We need your permission in order to find wifi networks"
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("Thank you for your permission! :)");
  //     } else {
  //       console.log(
  //         "You will not able to retrieve wifi available networks list"
  //       );
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }

  getWifiNetworksOnPress = () => {
    wifi.reScanAndLoadWifiList(
      wifiStringList => {
        console.log(wifiStringList);
        var wifiArray = JSON.parse(wifiStringList);
        console.log(wifiArray);
        this.setState({
          wifiList: wifiArray,
          modalVisible: false
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  timerWifiNetWork = () => {
    this.handler = setInterval(this.getWifiNetworksOnPress, 500);
  };

  getMagnetometerValue = () => {
    this.subscription = magnetometer.subscribe(({ x, y, z, timestamp }) => {
      // setTimeout(() => {
      //   subscription.unsubscribe();
      // }, 3000);
      console.log({ x, y, z, timestamp });
    });
  };
  // magnetometer.subscribe(({ x, y, z, timestamp }) => {
  //   console.log({ x, y, z, timestamp });
  //   this.setState({
  //     magModalVisible: true
  //   });
  // });

  // renderModal() {
  //   var wifiListComponents = [];
  //   for (w in this.state.wifiList) {
  //     wifiListComponents.push(
  //       <View key={w} style={styles.instructionsContainer}>
  //         <Text style={styles.instructionsTitle}>
  //           {this.state.wifiList[w].SSID}
  //         </Text>
  //         <Text>BSSID: {this.state.wifiList[w].BSSID}</Text>
  //         <Text>Capabilities: {this.state.wifiList[w].capabilities}</Text>
  //         <Text>Frequency: {this.state.wifiList[w].frequency}</Text>
  //         <Text>Level: {this.state.wifiList[w].level}</Text>
  //         <Text>Timestamp: {this.state.wifiList[w].timestamp}</Text>
  //       </View>
  //     );
  //   }
  //   return wifiListComponents;
  // }

  // renderMagModel() {
  //   return (
  //     <View style={styles.instructionsContainer}>
  //       <Text style={styles.instructionsTitle}>Magnetometer</Text>
  //     </View>
  //   );
  // }

  render() {
    const renderModal = () => {
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
    };
    const renderMagModel = () => {
      return (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Magnetometer</Text>
        </View>
      );
    };
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Explorer App</Text>
          {/* Start of the Start Wifi Component */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Get all wifi networks in range
            </Text>
            <TouchableHighlight
              style={styles.bigButton}
              // onPress={this.getWifiNetworksOnPress}
              onPress={this.timerWifiNetWork}
            >
              <Text style={styles.buttonText}>Available WIFI Networks</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              End Magnetometer Readings
            </Text>
            <TouchableHighlight
              style={styles.bigButton}
              onPress={() => clearInterval(this.handler)}
            >
              <Text style={styles.buttonText}>End Wifi Readings</Text>
            </TouchableHighlight>
          </View>
          {/* Start of The Magnetometer Component */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Get Magnetometer Values
            </Text>
            <TouchableHighlight
              style={styles.bigButton}
              onPress={this.getMagnetometerValue}
            >
              <Text style={styles.buttonText}>
                Available Magnetometer Values
              </Text>
            </TouchableHighlight>
          </View>
          {/* Start of The End Magnetometer Component */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              End Magnetometer Readings
            </Text>
            <TouchableHighlight
              style={styles.bigButton}
              onPress={() => this.subscription.unsubscribe()}
            >
              <Text style={styles.buttonText}>
                End The Reading of Magnetometer
              </Text>
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
          <ScrollView>{renderModal()}</ScrollView>
        </Modal>
        <Modal visible={this.state.magModalVisible} onRequestClose={() => {}}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this.setState({ magModalVisible: false })}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableHighlight>
          <ScrollView>{renderMagModel()}</ScrollView>
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
