import React, { createContext, useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { ADA_USER, ADA_KEY } from "../../env";
import { baseURL } from "../../env";
import uuid from "react-native-uuid";

import init from "react_native_mqtt";

import { screenMap, unit } from "../utils/ObjectMap";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let bodyContent = "";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [clientId, setclientId] = useState(null);
  const [isSignout, setIsSignOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let client = null;

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // console.log("ExpoPushToken: ", expoPushToken);

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // console.log("Notification content: ", notification);

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost: " + responseObject.errorMessage);
    }
  }

  function onFailure() {
    console.log("Failed to connect..");
  }

  function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);

    const payload = JSON.parse(message.payloadString)["feeds"];

    for (const feed in payload) {
      let feedId = feed.match(/[a-zA-Z-]+/g)[0];
      let value = Number(payload[feed]);
      console.log(feedId, ": ", value);
      // console.log("value type: ", typeof value);

      if (screenMap[feedId].type === "Measure") {
        console.log("min: ", screenMap[feedId].min);
        console.log("max: ", screenMap[feedId].max);

        if (
          screenMap[feedId].min !== undefined &&
          value < screenMap[feedId].min
        ) {
          // console.warn("Too low");
          bodyContent = `The ${screenMap[feedId].name} is too low: ${value} ${unit[feedId]}`;
          schedulePushNotification();
        } else if (
          screenMap[feedId].min !== undefined &&
          value > screenMap[feedId].max
        ) {
          // console.warn("Too High...");
          bodyContent = `The ${screenMap[feedId].name} is too high: ${value} ${unit[feedId]}`;
          schedulePushNotification();
        }
      } else {
        console.log("Interactive devices");
        console.log("min: ", screenMap[feedId].min);
        console.log("max: ", screenMap[feedId].max);

        if (
          screenMap[feedId].min !== undefined &&
          value < screenMap[feedId].min
        ) {
          // console.warn("Too low");
          bodyContent = `The ${screenMap[feedId].name} is too low: ${value} ${unit[feedId]}`;
          schedulePushNotification();
        } else if (
          screenMap[feedId].min !== undefined &&
          value > screenMap[feedId].max
        ) {
          // console.warn("Too High...");
          bodyContent = `The ${screenMap[feedId].name} is too high: ${value} ${unit[feedId]}`;
          schedulePushNotification();
        }
      }
    }
  }

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
            setUserToken(response.data["access-token"]);
            setUserInfo(response.data);
            setclientId(uuid.v4());
            if (userInfo) {
              AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
            }
            if (userToken) {
              AsyncStorage.setItem("userToken", userToken);
            }
            if (clientId) {
              AsyncStorage.setItem("clientId", clientId);
            }

            init({
              size: 10000,
              storageBackend: AsyncStorage,
              defaultExpires: 1000 * 3600 * 24,
              enableCache: true,
              reconnect: true,
              sync: {},
            });

            function onConnect() {
              console.log(clientId, " connected successfully...");
              client.subscribe("thaitran24/groups/home00000");
            }

            if (client === null) {
              client = new Paho.MQTT.Client(
                "io.adafruit.com",
                443,
                ""
                // clientId
              );
              client.onConnectionLost = onConnectionLost;
              client.onMessageArrived = onMessageArrived;
              client.connect({
                onSuccess: onConnect,
                onFailure: onFailure,
                useSSL: true,
                userName: ADA_USER,
                password: ADA_KEY,
              });
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
        setclientId(null);

        if (client !== null) {
          client.disconnect();
          client = null;
        }

        AsyncStorage.removeItem("userInfo");
        AsyncStorage.removeItem("userToken");
        AsyncStorage.removeItem("clientId");
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

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Alert! 📬",
      body: bodyContent,
      data: { data: "goes here" },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "29ae29a0-1354-41c6-aff6-062cefce1f34",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
