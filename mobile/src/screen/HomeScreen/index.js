import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomesScreen from "./HomesScreen";
import HomeScreen from "./HomeScreen";
import RoomScreen from "./RoomScreen";
import InteractiveDeviceScreen from "./InteractiveDeviceScreen";
import MeasureDeviceScreen from "./MeasureDeviceScreen";

import { screenMap } from "../../utils/ObjectMap";

const Stack = createNativeStackNavigator();

export default function HomeScreenStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Homes" component={HomesScreen} />
      <Stack.Screen
        name="My Home"
        component={HomeScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerTitleStyle: { color: "black" },
          headerBackTitleVisible: false,
        })}
      />
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
          title: screenMap[route.params.type].name,
          headerTitleStyle: { color: "black" },
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="InteractiveDevice"
        component={InteractiveDeviceScreen}
        options={({ route }) => ({
          title: screenMap[route.params.type].name,
          headerTitleStyle: { color: "black" },
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
