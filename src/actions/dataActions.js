import { appConfig } from "../apiConfig";

export function authentication(data) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/users/auth`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.token) alert("Nombre de usuario o Contraseña incorrecto");
        if (json.token) {
          localStorage.setItem("tecnoToken", json.token);
          dispatch({
            type: "USER_DATA",
            payload: { user: data.username, access: json.access },
          });
        }
      });
  };
}

export function getUserFromToken() {
  const token = localStorage.getItem("tecnoToken");
  if (token)
    return async function (dispatch) {
      return fetch(`${appConfig.url}/users/userByToken`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (!json.user) localStorage.removeItem("tecnoToken");
          dispatch({
            type: "USER_DATA",
            payload: json,
          });
        });
    };
}

export function getPlantList() {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/plants/list`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "TREE_PLANTS",
          payload: json,
        });
      });
  };
}

export function setPlantName(plant) {
  return {
    type: "PLANT_NAME",
    payload: plant,
  };
}

export function setYear(year) {
  return {
    type: "SET_YEAR",
    payload: Number(year),
  };
}

export function getPlantLocationTree(plantName) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/plants/locations/${plantName}`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "LOCATION_TREE",
          payload: json,
        });
      });
  };
}

export function getLineServicePoints(line) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/servicePoints/byLine/${line}`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: "LINE_SERVICE_POINTS",
          payload: json,
        });
      });
  };
}
