import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import { Slider } from "@miblanchard/react-native-slider";

const baseURL = "http://192.168.1.13:5001";

export default function InteractiveDeviceScreen() {
  const route = useRoute();
  const [value, setValue] = useState(route.params.curr_value);

  useEffect(() => {
    putData();
  }, [value]);

  const putData = () => {
    axios
      .put(`${baseURL}/api/device/${route.params.device_id}`, {
        data: value[0],
      })
      // .get(`${baseURL}/api/device`, {})
      .then(function (response) {
        // handle success
        console.log("InteractiveDevice: Successful!");
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };

  const deviceMap = {
    fan: {
      minValue: 0,
      maxValue: 100,
      stepValue: 25,
      key: {
        0: "Off",
        25: "25%",
        50: "50%",
        75: "75%",
        100: "100%",
      },
    },
    led: {
      minValue: 0,
      maxValue: 3,
      stepValue: 1,
      key: {
        0: "Off",
        1: "Red",
        2: "Yellow",
        3: "Blue",
      },
    },
    door: {
      minValue: 0,
      maxValue: 1,
      stepValue: 1,
      key: {
        0: "Closed",
        1: "Opened",
      },
    },
  };
  return (
    <View style={styles.container}>
      <Text style={styles.value}>
        {deviceMap[route.params.type].key[value]}
      </Text>
      <View style={styles.slider}>
        <Slider
          value={value}
          onValueChange={setValue}
          minimumValue={deviceMap[route.params.type].minValue}
          maximumValue={deviceMap[route.params.type].maxValue}
          step={deviceMap[route.params.type].stepValue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
    // margin: 10,
    backgroundColor: "#cccccc",
    // width: "100%",
  },
  value: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
  },
  slider: {
    // flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: "stretch",
    justifyContent: "center",
    width: 300,
  },
});
