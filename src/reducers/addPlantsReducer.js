const initialState = {
  plants: [],
  areas: [],
  lines: [],
  servicePoints: [],
  locationTree: {},
  actualData: {},
  creationResult: null,
  createdItems: [],
};

export default function addPlantsReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_PLANTS":
      let plants = action.payload;
      return {
        ...state,
        plants: plants,
        areas: [],
        lines: [],
        servicePoints: [],
      };
    case "GET_LOCATIONS":
      let areas = Object.keys(action.payload);
      return {
        ...state,
        areas: areas,
        lines: [],
        servicePoints: [],
        locationTree: action.payload,
      };

    case "GET_LINES":
      let lines = state.locationTree[action.payload];
      return {
        ...state,
        lines: lines,
        servicePoints: [],
      };
    case "GET_SERVICEPOINTS":
      return {
        ...state,
        servicePoints: action.payload,
      };
    case "ACTUAL_DATA":
      return {
        ...state,
        actualData: action.payload,
      };
    case "CREATION_RESULTS":
      return {
        state,
        creationResult: action.payload,
      };
    case "CREATION_RESET":
      return {
        state,
        creationResult: null,
      };
    default:
      return state;
  }
}
