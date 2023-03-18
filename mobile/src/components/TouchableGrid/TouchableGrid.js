import React from "react";

import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

export default function TouchableGrid(data, navigate, content) {
  return (
    <FlatList
      data={data}
      style={styles.list}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(navigate.name, navigate.routeData)}
        >
          <MaterialCommunityIcons
            name="bed-double-outline"
            color={"#048EF2"}
            size={75}
          />
          <View>
            <Text>{content}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({});
