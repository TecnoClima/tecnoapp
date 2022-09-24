const initialState = {
  plantList: [],
  areaList: [],
  lineList: [],
  spList: [],
  lineDetail: {},
  selectedPlant: {},
  plantResult: {},
};

export default function plantReducer(state = initialState, action) {
  const { error, success } = action.payload || {};
  let newList = [];

  function update(array) {
    if (success) {
      const index = state[array].findIndex(
        (p) =>
          p.name === action.payload.previous.name &&
          p.code === action.payload.previous.code
      );
      newList = [...state[array]];
      newList[index] = action.payload.success;
    }
    return {
      ...state,
      plantResult: action.payload,
      [array]: error ? state[array] : newList,
    };
  }

  function newItems(array) {
    return {
      ...state,
      plantResult: action.payload,
      [array]: error ? state[array] : [...state[array], ...success],
    };
  }

  function deleteItem(array) {
    return {
      ...state,
      plantResult: action.payload,
      [array]: error
        ? state[array]
        : state[array].filter((p) => p.code !== action.payload.code),
    };
  }

  switch (action.type) {
    case "PLANT_LIST":
      return { ...state, plantList: action.payload };
    // check this working
    // case "SELECTED_PLANT":
    //   return {
    //     ...state,
    //     plantList: state.plantList.includes(action.payload)
    //       ? state.plantList
    //       : [...state.plantlist, ...action.payload],
    //     plantResult: action.payload.error
    //       ? { error: action.payload.error }
    //       : { success: action.payload },
    //     selectedPlant: action.payload,
    //   };
    case "RESET_PLANT_RESULT":
      return { ...state, plantResult: {} };
    case "DELETE_PLANT":
      return deleteItem("plantList");
    case "UPDATE_PLANT":
      return update("plantList");
    case "CREATE_PLANT":
      return newItems("plantList");
    case "AREA_LIST":
      return {
        ...state,
        areaList: action.payload,
      };
    case "NEW_AREAS":
      return newItems("areaList");
    case "UPDATE_AREA":
      return update("areaList");
    case "DELETE_AREA":
      return deleteItem("areaList");

    case "LINE_LIST":
      return {
        ...state,
        lineList: action.payload,
      };
    case "LINE_DETAIL":
      return {
        ...state,
        lineDetail: action.payload,
      };
    case "NEW_LINES":
      return newItems("lineList");
    case "UPDATE_LINE":
      return update("lineList");
    case "DELETE_LINE":
      return deleteItem("lineList");

    case "SP_LIST":
      return {
        ...state,
        spList: action.payload,
      };
    case "NEW_SP":
      return newItems("spList");
    case "UPDATE_SP":
      return update("spList");
    case "DELETE_SP":
      return deleteItem("spList");
    case "SELECTED_PLANT":
      return {
        ...state,
        selectedPlant: action.payload,
      };
    default:
      return state;
  }
}
