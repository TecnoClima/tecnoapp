import { serverAction } from "./StoreActions";

export function callMostRecent(filters) {
  return serverAction({
    endpoint: `workorder/mostrecent`,
    method: "POST",
    body: filters,
    type: "MOST_RECENT",
  });
}

export function setDetail(order) {
  return {
    type: "ORDER_DETAIL",
    payload: order,
  };
}

export function resetOrderResult() {
  return {
    type: "RESET_ORDER_RESULT",
    payload: {},
  };
}

export function getWOOptions() {
  return serverAction({
    endpoint: `workorder/options`,
    method: "GET",
    type: "GET_WO_OPTIONS",
  });
}

export function newWorkOrder(order) {
  return serverAction({
    endpoint: `workorder`,
    method: "POST",
    body: order,
    type: "NEW_ORDER",
  });
}

export function updateOrder(code, update) {
  return serverAction({
    endpoint: `workorder/${code}`,
    method: "PUT",
    body: update,
    type: "NEW_ORDER",
  });
}

export function resetNewOrder() {
  return {
    type: "NEW_ORDER",
    payload: null,
  };
}

export function searchWO(code) {
  return serverAction({
    endpoint: `workorder/detail/${code}`,
    method: "GET",
    type: "ORDER_DETAIL",
  });
}

export function resetDetail() {
  return {
    type: "ORDER_DETAIL",
    payload: {},
  };
}

export function getWOList(conditions) {
  return serverAction({
    endpoint: `workorder/list`,
    method: "POST",
    body: conditions, //<--- to improve, should be a GET
    type: "ORDER_LIST",
  });
}

export function deleteOrder(code) {
  return serverAction({
    endpoint: `workorder/${code}`,
    method: "DELETE",
    type: "DELETED_ORDER",
  });
}

export function newIntervention(order, data) {
  return serverAction({
    endpoint: `intervention`,
    method: "POST",
    body: { order: order, ...data },
    type: "ADD_INTERVENTION",
  });
}

export function updateIntervention(id, update) {
  return serverAction({
    endpoint: `intervention`,
    method: "PUT",
    body: { id, update },
    type: "UPDATE_INTERVENTION",
  });
}

export function addCylinderUsage(intervention, user, gases) {
  return serverAction({
    endpoint: `cylinders/usages`,
    method: "POST",
    body: { intervention, user, gases },
    type: "ADD_USAGE",
  });
}

export function deleteCylinderUsage(intervention, user, usages) {
  return serverAction({
    endpoint: `cylinders/usages`,
    method: "DELETE",
    body: { intervention, user, usages },
    type: "DEL_USAGE",
  });
}
