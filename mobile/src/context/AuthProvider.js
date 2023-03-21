import React, {
  createContext,
  useState,
  useReducer,
  useEffect,
  useMemo,
} from "react";
// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { baseURL } from "../../env";
import { useRoute } from "@react-navigation/native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [isSignout, setIsSignOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const funcAuthContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        setIsLoading(true);
        const userData = new FormData();
        userData.append("username", data.username);
        userData.append("password", data.password);
        await axios
          .post(`${baseURL}/login`, userData)
          .then(function (response) {
            // console.log(response.data.data);
            // console.log(response.data["access-token"]);
            setUserToken(response.data["access-token"]);
            setUserInfo(response.data);
            if (userInfo) {
              AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
            }
            if (userToken) {
              AsyncStorage.setItem("userToken", userToken);
            }
            console.log("Login successful");
          })
          .catch(function (error) {
            console.log(error);
          });
        setIsLoading(false);
      },
      signOut: () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem("userInfo");
        AsyncStorage.removeItem("userToken");
        setIsLoading(false);
      },
      signUp: () => {},
    }),
    []
  );

  const isSignedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      let userToken = await AsyncStorage.getItem("userToken");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
        setUserToken(userToken);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isSignedIn();
  }, []);

  const header = {
    "access-token": userToken,
  };

  const authContext = {
    signIn: funcAuthContext.signIn,
    signOut: funcAuthContext.signOut,
    signUp: funcAuthContext.signUp,
    userToken,
    userInfo,
    isLoading,
    isSignout,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
