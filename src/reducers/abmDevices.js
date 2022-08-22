const initialState = {
  allDevices: [],
  devices: [],
  options: [],
  refrigerants: [],
  deviceData: {},
};

export default function abmDevicesReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_ALLDEVICES":
      return {
        ...state,
        devices: action.payload,
        allDevices: action.payload,
      };
    case "GET_ALLOPTIONS":
      return {
        ...state,
        options: action.payload,
      };
      case "DEVICE_DATA":
        let devData = state.allDevices.filter(
          (element) => element._id === action.payload
        );
        return {
          ...state,
          deviceData: devData[0],
        };
        case "RESET_DEVICE_DATA":
          return {
            ...state,
            deviceData: {},
          };
    default:
      return state;
  }
}
