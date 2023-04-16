import React, { Component } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";

import axios from "axios";

import { baseURL } from "../../../env";
import { AuthContext } from "../../context/AuthProvider";

import { unit } from "../../utils/ObjectMap";

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

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.content}>
            {this.state.value} {unit[this.props.route.params.type]}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
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
