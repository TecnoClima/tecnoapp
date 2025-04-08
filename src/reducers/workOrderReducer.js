const initialState = {
  mostRecent: [],
  workOrderOptions: {},
  workOrderList: [],
  orderDetail: {},
  updateResult: "",
  orderResult: {},
  reportData: null,
  assignedOrders: [],
  checkedData: null,
};

export default function workOrderReducer(state = initialState, action) {
  let detail = { ...state.orderDetail };
  let currentCodeList = [];
  let index = 0;
  let array = [];
  const error = action?.payload?.error || null;
  switch (action.type) {
    case "DELETED_ORDER":
      if (error) return { ...state, orderResult: { error } };
      return {
        state,
        workOrderList: state.workOrderList.filter(
          (o) => o.code !== action.payload.code
        ),
        orderResult: { success: `Orden ${action.payload.code} eliminada` },
      };
    case "NEW_ORDER":
      if (error) return { ...state, orderResult: { error } };
      return {
        ...state,
        workOrderList: [
          action.payload,
          ...state.workOrderList.filter((o) => o.code !== action.payload.code),
        ],
        orderResult: { success: action.payload.code },
      };
    case "CHECK_DATA":
      return {
        ...state,
        checkedData: action.payload,
      };
    case "LOAD_WORKORDER_FROM_EXCEL":
      return {
        ...state,
        orderResult: { success: "Todo se cargó exitosamente" },
        workOrderList: [
          ...action.payload.sort((a, b) => a.code < b.code),
          ...state.workOrderList,
        ],
      };
    case "UPDATE_ORDER":
      if (error) return { ...state, orderResult: { error } };
      return {
        ...state,
        workOrderList: state.workOrderList.map((o) => {
          if (o.code === action.payload.code) return action.payload;
          return o;
        }),
        orderDetail: { ...state.orderDetail, ...action.payload },
        orderResult: { success: action.payload.code },
      };
    case "RESET_ORDER_RESULT":
      return {
        ...state,
        orderResult: {},
      };
    case "RESET_REPORT":
      return {
        ...state,
        reportData: null,
      };
    case "MOST_RECENT":
      return {
        ...state,
        mostRecent: action.payload,
      };
    case "GET_WO_OPTIONS":
      return {
        ...state,
        workOrderOptions: action.payload,
      };
    case "ORDER_REPORT":
      return {
        ...state,
        reportData: action.payload,
      };
    case "ORDER_LIST":
      if (error) return { ...state, orderResult: { error } };
      currentCodeList = state.workOrderList.map((order) => order.code);
      let ordersToAdd = action.payload.filter(
        (order) => !currentCodeList.includes(order.code)
      );
      return {
        ...state,
        // workOrderList: [...state.workOrderList, ...ordersToAdd],
        workOrderList: ordersToAdd,
      };
    case "ORDER_DETAIL":
      return {
        ...state,
        orderDetail: action.payload,
      };
    case "ADD_INTERVENTION":
      detail.interventions.push(action.payload);
      return {
        ...state,
        orderDetail: detail,
      };
    case "UPDATE_INTERVENTION":
      index = detail.interventions.findIndex((e) => e.id === action.payload.id);
      for (let key of Object.keys(action.payload))
        detail.interventions[index][key] = action.payload[key];
      return {
        ...state,
        orderDetail: detail,
      };
    case "ADD_USAGE":
      index = detail.interventions.findIndex(
        (e) => e.id === action.payload.intervention
      );
      for (let use of action.payload.refrigerant.filter((use) => !!use.code)) {
        detail.interventions[index].refrigerant.push(use);
        detail.interventions[index].refrigerant[0].total += use.total;
      }
      return {
        ...state,
        orderDetail: detail,
      };
    case "ASSIGNED_ORDERS":
      return {
        ...state,
        assignedOrders: action.payload.list,
      };
    case "DEL_USAGE":
      index = detail.interventions.findIndex(
        (e) => e.id === action.payload.intervention
      );
      array = detail.interventions[index].refrigerant.filter(
        (usage) => !action.payload.ids.includes(usage.id)
      );
      detail.interventions[index].refrigerant = array;
      detail.interventions[index].refrigerant[0].total = array
        .filter((e) => !!e.code)
        .map((e) => e.total)
        .reduce((a, b) => a + b, 0);
      detail.interventions[index].task = action.payload.task;
      return {
        ...state,
        orderDetail: detail,
      };

    default:
      return state;
  }
}
