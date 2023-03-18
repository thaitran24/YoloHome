import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AntiTheftScreen() {
  return (
    <View style={styles.container}>
      <Text>This is Anti-Theft Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
