import { appConfig } from "../apiConfig";
import { serverAction } from "./StoreActions";

export function selectStrategy(strategy) {
  return {
    type: "SELECT_STRATEGY",
    payload: strategy,
  };
}

export function createStrategy(object) {
  return serverAction({
    endpoint: `strategies`,
    method: "POST",
    body: object,
    type: "NEW_PROGRAM",
  });
  // return async function (dispatch){
  //     return fetch(`${appConfig.url}/strategies`,{
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(object)
  //     })
  //     .then(response=>response.json())
  //     .then(json=>{
  //         dispatch({
  //             type: 'NEW_PROGRAM',
  //             payload: json
  //         })
  //     })
  // }
}

// export function updateStrategy (data) { serverAction(`strategies`,'PUT','UPDATE_PROGRAM',data) }
export function resetPlanResult() {
  return {
    type: "RESET_PLAN_RESULT",
    payload: {},
  };
}
export function updateStrategy(data) {
  return serverAction({
    endpoint: `strategies`,
    method: "PUT",
    body: data,
    type: "NEW_PROGRAM",
  });
  // return async function (dispatch){
  //     return fetch(`${appConfig.url}/strategies`,{
  //         method: 'PUT',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(data)
  //     })
  //     .then(response=>response.json())
  //     .then(json=>{
  //         if(!json.error)dispatch({
  //             type: 'UPDATE_PROGRAM',
  //             payload: json
  //         })
  //     })
  // }
}

//createPlan
export function setDeviceStrategy(planDevices) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/tasks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planDevices),
    })
      .then((response) => response.json())
      .then((json) => {
        const { errors, created } = json;
        if (errors.length > 0)
          alert(
            `Error${errors.length > 1 && "es"}:` +
              errors.map((item) => `${item.code}: ${item.detail}`)
          );
        if (created.device.length > 0)
          dispatch({
            type: "UPDATE_DEVICE_PLAN",
            payload: created,
          });
      });
  };
}

export function getStrategies(conditions) {
  return async function (dispatch) {
    const { plant, year } = conditions;
    let filter = plant || year ? "?" : "";
    if (plant) filter += "plant=" + plant;
    if (plant && year) filter += "&";
    if (year) filter += "year=" + year;

    return fetch(`${appConfig.url}/strategies${filter}`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "ALL_PROGRAMS",
          payload: json,
        });
      });
  };
}

export function getPlanDevices(conditions) {
  return async function (dispatch) {
    const { plant, year } = conditions;
    let filter = plant || year ? "?" : "";
    if (plant) filter += "plantName=" + plant;
    if (plant && year) filter += "&";
    if (year) filter += "year=" + year;

    return fetch(`${appConfig.url}/tasks${filter}`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "PLAN_DEVICES",
          payload: json,
        });
      });
  };
}

export function getDates(conditions) {
  return async function (dispatch) {
    const { plant, year } = conditions;
    let filter = plant || year ? "?" : "";
    if (plant) filter += "plant=" + plant;
    if (plant && year) filter += "&";
    if (year) filter += "year=" + year;

    return fetch(`${appConfig.url}/dates${filter}`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "DATES",
          payload: json,
        });
      });
  };
}

export function setDates(dates) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/dates`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dates),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "ADD_DATE",
          payload: json,
        });
      });
  };
}

export function getPlan(conditions) {
  return async function (dispatch) {
    const { plant, year, user } = conditions;
    let filter = `?year=${year}`;
    if (plant) filter += "&plant=" + plant;
    if (user) filter += "&user=" + user;

    return fetch(`${appConfig.url}/dates/plan${filter}`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "GET_PLAN",
          payload: json,
        });
      });
  };
}

export function dateOrder(order, date) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/tasks?order=${order}&date=${date}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order, date }),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "UPDATE_DATE",
          payload: json,
        });
      });
  };
}

export function selectTask(task) {
  return {
    type: "SELECT_TASK",
    payload: task,
  };
}
