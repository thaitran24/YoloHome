import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import axios from "axios";

// const baseURL = "http://10.230.182.70:5000";
const baseURL = "http://192.168.1.13:5001";

export default function HomeScreen({ navigation }) {
  const home_id = "home00000";
  const [room, setRoom] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoom();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const fetchRoom = () => {
    axios
      .get(`${baseURL}/api/room`, {})
      .then(function (response) {
        // handle success
        setRoom(
          response.data.data.filter(function (data) {
            return data.home_id == home_id;
          })
        );
        // console.log(data);
        console.log("Home: Successful!");
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={room}
        style={styles.list}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Room", {
                room_id: item._id,
                home_id: item.home_id,
                name: item.name,
              })
            }
          >
            <MaterialCommunityIcons
              name="bed-double-outline"
              color={"#048EF2"}
              size={90}
            />
            <View>
              <Text>{item.name}</Text>
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
