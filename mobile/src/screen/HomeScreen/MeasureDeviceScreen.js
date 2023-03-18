import React from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";

import { useRoute } from "@react-navigation/native";

export default function MeasureDeviceScreen() {
  const route = useRoute();
  const unit = {
    "temp-sensor": "oC",
    "light-sensor": "%",
    "humid-sensor": "%",
    "movement-sensor": "",
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.content}>
          {route.params.curr_value} {unit[route.params.type]}
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
