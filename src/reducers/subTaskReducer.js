const initialState = {
  list: [],
  selected: null,
  subTaskResult: {},
};

export default function subTaskReducer(state = initialState, action) {
  const { success, data, message } = action.payload || {};

  switch (action.type) {
    case "GET_SUBTASKS":
      return {
        ...state,
        list: success ? data : state.list,
        subTaskResult: success ? {} : { error: message },
      };
    case "GET_SUBTASK":
      return {
        ...state,
        selected: success ? data : state.selected,
        subTaskResult: success ? {} : { error: message },
      };
    case "NEW_SUBTASK":
      return {
        ...state,
        list: success ? [...state.list, data] : state.list,
        subTaskResult: success ? { success: message } : { error: message },
      };
    case "UPDATE_SUBTASK":
      return {
        ...state,
        list: success
          ? state.list.map((s) => (s._id === data._id ? data : s))
          : state.list,
        subTaskResult: success ? { success: message } : { error: message },
      };
    case "DELETE_SUBTASK":
      return {
        ...state,
        list: success
          ? state.list.filter((s) => s._id !== action.payload.id)
          : state.list,
        subTaskResult: success ? { success: message } : { error: message },
      };
    case "RESET_SUBTASK_RESULT":
      return { ...state, subTaskResult: {} };
    default:
      return state;
  }
}
