import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

import { Video } from "expo-av";

import { AuthContext } from "../../context/AuthProvider";

export default function AntiTheftScreen() {
  const { decodedVideo, detectingTime, setDetectingTime } =
    useContext(AuthContext);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.time}>
        <Text style={styles.timeText}>
          Latest time:{" "}
          {detectingTime === null
            ? "No update"
            : detectingTime.toLocaleString()}
        </Text>
      </View>
      <View style={styles.videoContainer}>
        <Video
          source={{
            // uri: "file:///home/ptmsk/university/Multidisciplinary_Project/refactor/YoloHome/mobile/assets/345494089_6146328358794501_1755358773750852284_n.mp4",
            // uri: "data:video/mp4;base64," + decodedVideo,
            uri: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1",
          }}
          style={styles.video}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
        <Text>Hello</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  time: {
    flex: 0.25,
    flexDirection: "row",
    alignItems: "flex-end",
    // backgroundColor: "#cccccc",
    margin: 10,
  },
  timeText: {
    fontFamily: "Arial Rounded MT Bold",
    fontSize: 20,
  },
  videoContainer: {
    flex: 0.75,
    width: "100%",
    backgroundColor: "#cccccc",
  },
  video: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 250,
    // width: "100%",
  },
});
