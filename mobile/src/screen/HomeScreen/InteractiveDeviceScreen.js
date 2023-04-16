import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, Text, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import { Slider } from "@miblanchard/react-native-slider";

import { AuthContext } from "../../context/AuthProvider";

import { baseURL } from "../../../env";

import CustomButton from "../../components/CustomButton";

import { deviceMode } from "../../utils/ObjectMap";

export default function InteractiveDeviceScreen() {
  const { userToken } = useContext(AuthContext);

  const route = useRoute();
  const [isFirstTime, setIsFisrtTime] = useState(true);
  const [value, setValue] = useState(route.params.curr_value);

  useEffect(() => {
    putData();
  }, [value]);

  const form = new FormData();
  form.append("data", value);

  const putData = () => {
    if (isFirstTime === true) {
      setIsFisrtTime(false);
    } else {
      axios
        .put(`${baseURL}/api/v1/device/${route.params.device_id}`, form, {
          headers: {
            "access-token": userToken,
          },
        })
        .then(function (response) {
          // handle success
          console.log("InteractiveDevice: Send Data Successful!");
        })
        .catch(function (error) {
          // handle error
          alert(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={deviceMode[route.params.type]}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <CustomButton
              text={item.key}
              onPress={() => {
                setValue(item.value);
                console.log("Sending", item.value, "...");
              }}
              bgColor={item.color}
              type={"ROUND"}
            />
          )}
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
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
