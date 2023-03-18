import React, { useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// import { AuthContext } from "./AuthProvider";

import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

export default function Navigation() {
  const isLogin = true;
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLogin ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
