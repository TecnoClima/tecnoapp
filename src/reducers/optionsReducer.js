const initialState = {
  options: {},
  optionsResult: null,
};

export default function optionsReducer(state = initialState, action) {
  // const success = action?.payload?.success || null;
  const error = action?.payload?.error || null;
  if (error) return { ...state, deviceResult: { error } };
  const { model, option, values } = action.payload || {};
  switch (action.type) {
    case "GET_OPTIONS":
      return {
        ...state,
        options: action.payload,
      };
    case "UPDATE_OPTIONS":
      if (!model || !option || !values?.[0]) {
        return state;
      } else {
        const newValues = [];
        values.forEach((v) =>
          newValues.push(
            state.options[model][option].find((o) => o.value === v)
          )
        );
        return {
          ...state,
          options: {
            ...state.options,
            [model]: { ...state.options[model], [option]: newValues },
          },
        };
      }
    default:
      return state;
  }
}
