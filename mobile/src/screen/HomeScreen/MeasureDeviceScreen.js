import React, { Component } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";

import axios from "axios";

import { baseURL } from "../../../env";
import { AuthContext } from "../../context/AuthProvider";

import { MaterialCommunityIcons } from "react-native-vector-icons";
import { unit, screenMap } from "../../utils/ObjectMap";

export default class MeasureDeviceScreen extends Component {
  static contextType = AuthContext;

  state = {
    userToken: "",
    value: this.props.route.params.curr_value,
  };

  componentDidMount() {
    fetchData = () => {
      axios
        .get(`${baseURL}/api/v1/device/${this.props.route.params.device_id}`, {
          headers: {
            "access-token": this.state.userToken,
          },
        })
        .then((response) => {
          this.setState({
            value: response.data.data[0].curr_value,
          });
          console.log("State value: ", this.state.value);
          console.log("MeasureDeviceScreen: Fetch successful!");
        })
        .catch(function (error) {
          // handle error
          alert(error.message);
        });
    };

    this.interval = setInterval(() => {
      fetchData();
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  render() {
    const { userToken } = this.context;

    this.state.userToken = userToken;

    // return (
    //   <SafeAreaView style={styles.container}>
    //     <View style={styles.box}>
    //       <Text style={styles.content}>
    //         {this.state.value} {unit[this.props.route.params.type]}
    //       </Text>
    //     </View>
    //   </SafeAreaView>
    // );

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.info}>
          <View style={styles.data}>
            <Text style={styles.content}>{this.state.value}</Text>
            <Text style={styles.unit}>
              {unit[this.props.route.params.type]}
            </Text>
          </View>
          <View style={styles.icon}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {screenMap[this.props.route.params.type].name}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={screenMap[this.props.route.params.type].icon}
              color={"#048EF2"}
              size={100}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#005c99",
  },
  info: {
    justifyContent: "center",
  },
  data: {
    paddingLeft: "10%",
    marginHorizontal: "1%",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  content: {
    fontSize: 120,
    fontFamily: "Arial Rounded MT Bold",
    color: "#048EF2",
  },
  unit: {
    fontSize: 70,
    fontFamily: "Arial Rounded MT Bold",
    color: "#898A8D",
    margin: 10,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingLeft: "7%",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 30,
  },
  name: {
    fontSize: 45,
    fontFamily: "Arial Rounded MT Bold",
    color: "#898A8D",
  },
});
