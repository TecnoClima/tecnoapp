const initialState = {
  workersList: [],
  supervisors: [],
  userData: "",
  userList: [],
  userFilters: "",
  userOptions: "",
  selectedUser: "",
  peopleResult: {},
  userDetail: undefined,
};

export default function workOrderReducer(state = initialState, action) {
  // console.log(action.type, action.payload);
  switch (action.type) {
    case "USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };
    case "LOGIN":
      return {
        ...state,
        peopleResult: action.payload,
      };
    case "USER_DETAIL":
      return {
        ...state,
        userDetail: action.payload,
      };
    case "UPDATE_USER":
      let newList = [...state.userList];
      let index = state.userList.findIndex((u) => u._id === action.payload._id);
      index >= 0
        ? (newList[index] = action.payload)
        : (newList = [action.payload]);
      return {
        ...state,
        userList: newList,
      };
    case "WORKERS_LIST":
      return {
        ...state,
        workersList: action.payload,
      };
    case "SUPERVISORS":
      return {
        ...state,
        supervisors: action.payload,
      };
    case "USER_LIST":
      return {
        ...state,
        userList: action.payload,
      };
    case "USER_OPTIONS":
      return {
        ...state,
        userOptions: action.payload,
      };
    case "SELECTED_USER":
      if (action.payload.error)
        return { ...state, peopleResult: { error: action.payload.error } };
      return {
        ...state,
        peopleResult: { success: action.payload.idNumber },
        selectedUser: action.payload,
      };
    case "NEW_USER":
      return {
        ...state,
        peopleResult: action.payload,
      };
    case "RESET_PEOPLE_RESULT":
      return {
        ...state,
        peopleResult: {},
      };
    default:
      return state;
  }
}
