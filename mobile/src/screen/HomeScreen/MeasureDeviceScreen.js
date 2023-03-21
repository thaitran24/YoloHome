import React, { useState, useContext, useEffect } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";

import { useRoute } from "@react-navigation/native";

import axios from "axios";

import { baseURL } from "../../../env";
import { AuthContext } from "../../context/AuthProvider";

import { unit } from "../../utils/ObjectMap";

export default function MeasureDeviceScreen() {
  const { userToken, userInfo } = useContext(AuthContext);

  const [value, setValue] = useState(0);

  const route = useRoute();
  // const unit = {
  //   "temp-sensor": "oC",
  //   "light-sensor": "%",
  //   "humid-sensor": "%",
  //   "movement-sensor": "",
  // };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${baseURL}/api/v1/device/${route.params.device_id}`, {
        headers: {
          "access-token": userToken,
        },
      })
      .then(function (response) {
        // handle success
        setValue(response.data.data[0].curr_value);
        console.log("MeasureDeviceScreen: Fetch successful!");
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.content}>
          {value} {unit[route.params.type]}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 50,
    height: 250,
    width: 250,
    padding: 10,
    marginHorizontal: "1%",
    marginBottom: 10,
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "#005c99",
    justifyContent: "center",
  },
  content: {
    fontSize: 50,
    color: "#FFFFFF",
  },
});
