import { appConfig } from "../apiConfig";
const plantCode = appConfig.plantConfig.code;
const token = "Bearer " + localStorage.getItem("tecnoToken");
const baseURL = appConfig.url;

export function getDeviceList(plantCode) {
  return async function (dispatch) {
    return fetch(`${baseURL}/devices/filters`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ plant: plantCode }),
    })
      .then((response) => response.json())
      .then((json) =>
        dispatch({
          type: "FULL_DEVICE_LIST",
          payload: json.list,
        })
      );
  };
}

export function getPartialDeviceList(filters) {
  filters.plant = plantCode;
  return async function (dispatch) {
    return fetch(`${baseURL}/devices/filters`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(filters),
    })
      .then((response) => response.json())
      .then((json) =>
        dispatch({
          type: "PARTIAL_LIST",
          payload: json.list,
        })
      );
  };
}

export function getDeviceFilters() {
  return async function (dispatch) {
    return fetch(`${baseURL}/devices/filters?plant=${plantCode}`)
      .then((response) => response.json())
      .then((json) =>
        dispatch({
          type: "DEVICE_FILTERS",
          payload: json,
        })
      )
      .catch((e) => console.error(e.message));
  };
}
export function viewDevice(code) {
  return {
    type: "DEVICE_VIEW",
    payload: code,
  };
}
export function getDeviceFromList(device) {
  return {
    type: "DEVICE_DETAIL",
    payload: device,
  };
}
export function searchWODevice(devCode) {
  return async function (dispatch) {
    return fetch(`${baseURL}/devices/filters`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ filters: { code: devCode } }),
    })
      .then((response) => response.json())
      .then((json) =>
        dispatch({
          type: "DEVICE_DETAIL",
          payload: json.list[0],
        })
      );
  };
}
export function deviceListByLine(lineName) {
  return async function (dispatch) {
    return fetch(`${baseURL}/devices/byLine/${lineName}`)
      .then((response) => response.json())
      .then((json) =>
        dispatch({
          type: "PARTIAL_LIST",
          payload: json,
        })
      )
      .catch((e) => console.error(e.message));
  };
}
export function deviceByName(string) {
  return async function (dispatch) {
    return fetch(`${baseURL}/devices/byName/${string}`)
      .then((response) => response.json())
      .then((json) =>
        dispatch({
          type: "PARTIAL_LIST",
          payload: json,
        })
      )
      .catch((e) => console.error(e.message));
  };
}

export function getDeviceOptions() {
  return async function (dispatch) {
    return fetch(`${baseURL}/devices/options`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((json) =>
        dispatch({
          type: "DEVICE_OPTIONS",
          payload: json,
        })
      )
      .catch((e) => console.error(e.message));
  };
}
