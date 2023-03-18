import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import RoomScreen from "./RoomScreen";
import InteractiveDeviceScreen from "./InteractiveDeviceScreen";
import MeasureDeviceScreen from "./MeasureDeviceScreen";

const Stack = createNativeStackNavigator();

export default function HomeScreenStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Home" component={HomeScreen} />
      <Stack.Screen
        name="Room"
        component={RoomScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerTitleStyle: { color: "black" },
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="MeasureDevice"
        component={MeasureDeviceScreen}
        options={({ route }) => ({
          title: route.params.device_id,
          headerTitleStyle: { color: "black" },
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="InteractiveDevice"
        component={InteractiveDeviceScreen}
        options={({ route }) => ({
          title: route.params.device_id,
          headerTitleStyle: { color: "black" },
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
