import React, { useEffect, useState, useContext } from "react";
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

import { AuthContext } from "../../context/AuthProvider";
import { baseURL } from "../../../env";

import { screenMap } from "../../utils/ObjectMap";

export default function RoomScreen({ navigation }) {
  const { userInfo, userToken } = useContext(AuthContext);

  const [roomInfo, setRoomInfo] = useState([]);

  const route = useRoute();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevice();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const fetchDevice = () => {
    axios
      .get(`${baseURL}/api/v1/device`, {
        headers: {
          "access-token": userToken,
        },
      })
      .then(function (response) {
        // handle success
        setRoomInfo(
          response.data.data.filter(function (data) {
            return (
              data.home_id == userInfo.data.home_id &&
              data.room_id == route.params.room_id
            );
          })
        );
        console.log("Room: Fetch Successful!");
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={roomInfo}
        style={styles.list}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(`${screenMap[item.type].type}Device`, {
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
