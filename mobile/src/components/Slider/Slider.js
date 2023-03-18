import React from "react";
import PropTypes from "prop-types";
import { Text, View } from "react-native";

import { Slider } from "@miblanchard/react-native-slider";

function CustomSlider(props) {
  return (
    <View>
      <Text>
        This is slider with {props.minValue}, {props.maxValue},{" "}
        {props.stepValue}
      </Text>
      <Slider
        value={props.value}
        onValueChange={props.onValueChange}
        minimumValue={props.minValue}
        maximumValue={props.maxValue}
        step={props.stepValue}
      />
    </View>
  );
}

Slider.propTypes = {
  value: PropTypes.any.isRequired,
  onValueChange: PropTypes.any.isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  stepValue: PropTypes.number,
};

export default Slider;
