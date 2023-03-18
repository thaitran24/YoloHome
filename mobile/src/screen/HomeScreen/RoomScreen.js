import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import TouchableGrid from "../../components/TouchableGrid/TouchableGrid";

const baseURL = "http://192.168.1.13:5001";
// const baseURL = "http://10.230.182.70:5000";

export default function RoomScreen({ navigation }) {
  const [data, setData] = useState([]);

  const route = useRoute();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevice();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const fetchDevice = () => {
    axios
      .get(`${baseURL}/api/device`, {})
      .then(function (response) {
        // handle success
        setData(
          response.data.data.filter(function (data) {
            return (
              data.home_id == route.params.home_id &&
              data.room_id == route.params.room_id
            );
          })
        );
        console.log("Room: Successful!");
        // console.log(data);
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };

  const screenMap = {
    fan: {
      type: "Interactive",
      icon: "fan",
    },
    door: {
      type: "Interactive",
      icon: "door",
    },
    led: {
      type: "Interactive",
      icon: "lightbulb-multiple-outline",
    },
    "temp-sensor": {
      type: "Measure",
      icon: "thermometer-low",
    },
    "light-sensor": {
      type: "Measure",
      icon: "alarm-light-outline",
    },
    "humid-sensor": {
      type: "Measure",
      icon: "water-percent",
    },
    "movement-sensor": {
      type: "Measure",
      icon: "run-fast",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        style={styles.list}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(screenMap[item.type].type + "Device", {
                device_id: item._id,
                curr_value: item.curr_value,
                type: item.type,
              })
            }
          >
            <MaterialCommunityIcons
              name={screenMap[item.type].icon}
              color={"#048EF2"}
              size={75}
            />
            <View>
              <Text>{item._id}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    // width: "100%",
    alignContent: "center",
  },
  card: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    height: 175,
    width: 175,
    padding: 10,
    marginHorizontal: "1%",
    marginBottom: 10,
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
});
