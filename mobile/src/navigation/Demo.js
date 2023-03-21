import React from "react";
import { SafeAreaView, Text, View, StyleSheet, FlatList } from "react-native";

import CustomButton from "../components/CustomButton";

export default function Demo() {
  const onDemoPress = () => {
    console.log("Pressed!!");
  };

  const device_mode = {
    fan: [
      { key: "Off", value: 0, color: "#8c8c8c" },
      { key: "25%", value: 25, color: "#33adff" },
      { key: "50%", value: 50, color: "#b3b300" },
      { key: "75%", value: 75, color: "#ff9900" },
      { key: "100%", value: 100, color: "#cc3300" },
    ],
    led: [
      { key: "Off", value: 0, color: "#8c8c8c" },
      { key: "Red", value: 1, color: "#cc3300" },
      { key: "Yellow", value: 2, color: "#e6e600" },
      { key: "Blue", value: 3, color: "#0099ff" },
    ],
    door: [
      { key: "Closed", value: 0, color: "#8c8c8c" },
      { key: "Opened", value: 1, color: "#669900" },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={device_mode.door}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <CustomButton
              text={item.key}
              onPress={onDemoPress}
              bgColor={item.color}
              type={"ROUND"}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#686D76",
  },
});
