const initialState = {
  list: [],
  selected: null,
  optionResult: {},
};

export default function optionReducer(state = initialState, action) {
  const { success, data, message } = action.payload || {};

  switch (action.type) {
    case "GET_OPTIONS":
      return {
        ...state,
        list: success ? data : state.list,
        optionResult: success ? {} : { error: message },
      };
    case "GET_OPTION":
      return {
        ...state,
        selected: success ? data : state.selected,
        optionResult: success ? {} : { error: message },
      };
    case "NEW_OPTION":
      return {
        ...state,
        list: success ? [...state.list, data] : state.list,
        optionResult: success ? { success: message } : { error: message },
      };
    case "UPDATE_OPTION":
      return {
        ...state,
        list: success
          ? state.list.map((o) => (o._id === data._id ? data : o))
          : state.list,
        optionResult: success ? { success: message } : { error: message },
      };
    case "DELETE_OPTION":
      return {
        ...state,
        list: success
          ? state.list.filter((o) => o._id !== action.payload.id)
          : state.list,
        optionResult: success ? { success: message } : { error: message },
      };
    case "RESET_OPTION_RESULT":
      return { ...state, optionResult: {} };
    default:
      return state;
  }
}
