const initialState = {
  list: [],
  selected: null,
  techTaskTemplateResult: {},
};

export default function techTaskTemplateReducer(state = initialState, action) {
  const { success, data, message } = action.payload || {};

  switch (action.type) {
    case "GET_TECHTASKTEMPLATES":
      return {
        ...state,
        list: success ? data : state.list,
        techTaskTemplateResult: success ? {} : { error: message },
      };
    case "GET_TECHTASKTEMPLATE":
      return {
        ...state,
        selected: success ? data : state.selected,
        techTaskTemplateResult: success ? {} : { error: message },
      };
    case "NEW_TECHTASKTEMPLATE":
      return {
        ...state,
        list: success ? [...state.list, data] : state.list,
        techTaskTemplateResult: success
          ? { success: message }
          : { error: message },
      };
    case "UPDATE_TECHTASKTEMPLATE":
      return {
        ...state,
        list: success
          ? state.list.map((s) => (s._id === data._id ? data : s))
          : state.list,
        techTaskTemplateResult: success
          ? { success: message }
          : { error: message },
      };
    case "DELETE_TECHTASKTEMPLATE":
      return {
        ...state,
        list: success
          ? state.list.filter((s) => s._id !== action.payload.id)
          : state.list,
        techTaskTemplateResult: success
          ? { success: message }
          : { error: message },
      };
    case "RESET_TECHTASKTEMPLATE_RESULT":
      return { ...state, techTaskTemplateResult: {} };
    default:
      return state;
  }
}
