export const screenMap = {
  fan: {
    type: "Interactive",
    icon: "fan",
  },
  door: {
    type: "Interactive",
    icon: "door",
  },
  led: {
    type: "Interactive",
    icon: "lightbulb-multiple-outline",
  },
  "temp-sensor": {
    type: "Measure",
    icon: "thermometer-low",
  },
  "light-sensor": {
    type: "Measure",
    icon: "alarm-light-outline",
  },
  "humid-sensor": {
    type: "Measure",
    icon: "water-percent",
  },
  "movement-sensor": {
    type: "Measure",
    icon: "run-fast",
  },
};

export const deviceMode = {
  fan: [
    { key: "75%", value: 75, color: "#ff9900" },
    { key: "100%", value: 100, color: "#cc3300" },
    { key: "25%", value: 25, color: "#33adff" },
    { key: "50%", value: 50, color: "#b3b300" },
    { key: "Off", value: 0, color: "#8c8c8c" },
  ],
  led: [
    { key: "Off", value: 0, color: "#8c8c8c" },
    { key: "Red", value: 1, color: "#cc3300" },
    { key: "Yellow", value: 2, color: "#e6e600" },
    { key: "Blue", value: 3, color: "#0099ff" },
  ],
  door: [
    { key: "Closed", value: 0, color: "#8c8c8c" },
    { key: "Opened", value: 1, color: "#669900" },
  ],
};

export const unit = {
  "temp-sensor": "oC",
  "light-sensor": "%",
  "humid-sensor": "%",
  "movement-sensor": "",
};
