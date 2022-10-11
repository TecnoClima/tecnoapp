const initialState = {
  workers: [],
  refrigerants: [],
  allCylinders: [],
  cylinderResult: {},
};

export default function adminCylindersReducer(state = initialState, action) {
  let cylindersList = [...state.allCylinders];
  let index = undefined;

  switch (action.type) {
    case "GET_CYLINDERS":
      console.log("GET_CYLINDERS", action.payload);
      return {
        ...state,
        cylinders: action.payload,
        allCylinders: action.payload,
      };

    case "GET_WORKERS":
      let empleados = action.payload
        .filter(
          (element) =>
            (element.access === "Worker" || element.access === "Supervisor") &&
            element.active
        )
        .map((element) => {
          return { id: element.id, name: element.name };
        });
      return {
        ...state,
        workers: empleados,
      };

    case "GET_REFRIGERANTS":
      let refrigerants = action.payload.map((element) => {
        return {
          id: element._id,
          code: element.code,
          refrigerante: element.refrigerante,
        };
      });
      return {
        ...state,
        refrigerants: refrigerants,
      };

    case "RESET_CYLINDER_RESULT":
      return {
        ...state,
        cylinderResult: action.payload,
      };

    case "DELETE_CYLINDER":
      if (action.payload.error)
        return { ...state, cylinderResult: { error: action.payload.error } };
      index = state.allCylinders.findIndex((e) => e.id === action.payload.id);
      cylindersList.splice(index, 1);
      return {
        ...state,
        allCylinders: cylindersList,
        cylinderResult: { success: action.payload.message },
      };

    case "UPDATE_CYLINDER":
      if (action.payload.error)
        return { ...state, cylinderResult: { error: action.payload.error } };
      index = state.allCylinders.findIndex((e) => e.id === action.payload.id);
      cylindersList[index] = {
        ...action.payload,
        assignedTo: action.payload.user,
      };
      return {
        ...state,
        allCylinders: cylindersList,
        cylinderResult: {
          success: `Garrafa ${action.payload.code} actualizada`,
        },
      };

    case "NEW_CYLINDER":
      if (action.payload.error)
        return { ...state, cylinderResult: { error: action.payload.error } };
      cylindersList.push(action.payload);
      return {
        ...state,
        allCylinders: cylindersList.sort((a, b) => (a.code > b.code ? 1 : -1)),
        cylinderResult: { success: `Garrafa ${action.payload.code} creada` },
      };

    default:
      return state;
  }
}
