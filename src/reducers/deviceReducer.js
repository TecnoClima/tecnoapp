const initialState = {
  deviceFullList: [],
  deviceFilters: [],
  partialList: [],
  deviceOptions: {},
  selectedDevice: {},
  deviceResult: {},
  devicePage: {},
  deviceReportData: [],
  deviceView: "",
  deviceHistory: {},
};

export default function deviceReducer(state = initialState, action) {
  const success = action?.payload?.success || null;
  const error = action?.payload?.error || null;
  if (error) return { ...state, deviceResult: { error } };
  switch (action.type) {
    case "UPDATE_DEVICE":
      // console.log("action.payload", action.payload);
      let newList = [...state.deviceFullList];
      if (success) {
        let index = state.deviceFullList.findIndex(
          (d) => d.code === success.code
        );
        newList[index] = success;
      }
      return {
        ...state,
        deviceResult: action.payload,
        deviceFullList: newList,
        selectedDevice: success || state.selectedDevice,
      };
    case "DEVICE_PAGE":
      return {
        ...state,
        devicePage: action.payload,
      };
    case "LOAD_DEVICE_EXCEL":
      return {
        ...state,
        deviceResult: action.payload,
      };
    case "NEW_DEVICE":
      return {
        ...state,
        deviceFullList: state.deviceFullList.concat(success || []),
        deviceResult: action.payload,
      };
    case "DEVICE_DETAIL":
      if (action.payload && action.payload.error)
        return { ...state, deviceResult: { error: action.payload.error } };
      return {
        ...state,
        selectedDevice: action.payload,
        deviceResult: { success: action.payload.code },
        deviceFullList: state.deviceFullList[0]
          ? state.deviceFullList
              .map((d) => d.code)
              .includes(action.payload.code)
            ? state.deviceFullList
            : [...state.deviceFullList, action.payload]
          : [],
      };
    case "DEVICE_REPORT": {
      return {
        ...state,
        deviceReportData: action.payload,
      };
    }
    case "RESET_DEVICE_RESULT": {
      return { ...state, deviceResult: {} };
    }
    case "RESET_DEVICE": {
      return { ...state, selectedDevice: {} };
    }
    case "FULL_DEVICE_LIST":
      return {
        ...state,
        deviceFullList: action.payload,
      };
    case "PARTIAL_LIST":
      return {
        ...state,
        partialList: action.payload,
      };
    case "DEVICE_FILTERS":
      return {
        ...state,
        deviceFilters: action.payload,
      };
    case "DEVICE_VIEW":
      return {
        ...state,
        deviceView: action.payload,
      };
    case "DEVICE_OPTIONS":
      return {
        ...state,
        deviceOptions: action.payload,
      };
    case "DEVICE_HISTORY":
      return {
        ...state,
        deviceHistory: action.payload,
      };
    default:
      return state;
  }
}
