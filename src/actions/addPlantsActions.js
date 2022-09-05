// import { appConfig } from "../apiConfig";

// export function getPlantList() {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/plants/list`)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "GET_PLANTS",
//           payload: json,
//         });
//       });
//   };
// }

// export function getPlantLocation(plantName) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/plants/locations/${plantName}`)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "GET_LOCATIONS",
//           payload: json.tree,
//         });
//         return json.tree;
//       });
//   };
// }

// export function getPlantLines(areaName) {
//   return async function (dispatch) {
//     dispatch({
//       type: "GET_LINES",
//       payload: areaName,
//     });
//   };
// }

// export function getLineServicePoints(line) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/servicePoints/byLine/${line}`)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "GET_SERVICEPOINTS",
//           payload: json,
//         });
//         return json;
//       });
//   };
// }

// export function addPlant(plant) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/plants/`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(plant),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function deletePlant(plant) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/plants/delete`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(plant),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function getPlantData(plant) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/plants/getPlantByName/${plant}`)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "ACTUAL_DATA",
//           payload: json,
//         });
//         return json;
//       });
//   };
// }

// export function updatePlant(plant) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/plants/update`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(plant),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function addArea(data) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/areas/`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function deleteArea(area) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/areas/oneArea`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(area),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function getAreaData(area) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/areas/getAreaByName/${area}`)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "ACTUAL_DATA",
//           payload: json,
//         });
//         return json;
//       });
//   };
// }

// export function updateArea(area) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/areas/update`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(area),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function addLine(data) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/lines/`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function deleteLine(line) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/lines/oneLine`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(line),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function updateLine(line) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/lines/update`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(line),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function getLineData(line) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/lines/getLineByName/${line}`)
//       .then((response) => response.json())
//       .then((json) =>
//         dispatch({
//           type: "ACTUAL_DATA",
//           payload: json,
//         })
//       );
//   };
// }

// export function addPlantCreationReset() {
//   return {
//     type: "CREATION_RESET",
//     payload: null,
//   };
// }

// export function addServPoint(data) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/servicePoints/`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "CREATION_RESULTS",
//           payload: json,
//         });
//         return json;
//       });
//   };
// }

// export function deleteServicePoint(servicePoint) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/servicePoints/oneServicePoint`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(servicePoint),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function updateServicePoint(servicePoint) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/servicePoints/update`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(servicePoint),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function getSPData(servicePoint) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/servicePoints/getSPByName/${servicePoint}`)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "ACTUAL_DATA",
//           payload: json,
//         });
//         return json;
//       });
//   };
// }
