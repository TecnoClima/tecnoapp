import { appConfig } from "../apiConfig";
const token = localStorage.getItem("tecnoToken");

function jsonToQuery(json) {
  if (!json) return "";
  const keys = Object.keys(json);
  if (!keys[0]) return "";
  return (
    "?" +
    Object.keys(json)
      .map((key) => `${key}=${json[key]}`)
      .join("&")
  );
}

export function serverAction(data) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/${data.endpoint}`, {
      method: data.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: data.body ? JSON.stringify(data.body) : undefined,
    })
      .then((response) => response.json())
      .then((json) => dispatch({ type: data.type, payload: json }))
      .catch((e) => console.error(e));
  };
}

const getAction = (endpoint, type) =>
  serverAction({ endpoint, method: "GET", type });
const postAction = (endpoint, body, type) =>
  serverAction({ endpoint, method: "POST", body, type });
const putAction = (endpoint, body, type) =>
  serverAction({ endpoint, method: "PUT", body, type });
const deleteAction = (endpoint, type) =>
  serverAction({ endpoint, method: "DELETE", type });
// const postFile = (endpoint, body, type) =>
//   serverAction({ endpoint, method: "POST", body, type });

//Cylinder Actions
export const cylinderActions = {
  getList: (array) =>
    getAction(`cylinders${array ? `?ids=[${array}]` : ``}`, "GET_CYLINDERS"),
  addNew: (cylinder) => postAction(`cylinders`, cylinder, "NEW_CYLINDER"),
  update: (cylinder) => putAction(`cylinders`, cylinder, "UPDATE_CYLINDER"),
  delete: (id) => deleteAction(`cylinders?id=${id}`, "DELETE_CYLINDER"),
  resetResult: () => ({ type: "RESET_CYLINDER_RESULT", payload: {} }),
  getGases: () => getAction("cylinders/refrigerant", "GET_REFRIGERANTS"),
  resetList: () => ({ type: "GET_CYLINDERS", payload: [] }),
};

//People Actions
export const peopleActions = {
  getWorkers: (cond) =>
    getAction(
      `users${jsonToQuery({ ...cond, access: "Worker" })}`,
      "WORKERS_LIST"
    ),
  getSupervisors: (plant) =>
    getAction(
      `users?access=Supervisor${plant ? `&plant=${plant}` : ""}`,
      "SUPERVISORS"
    ),
  getOptions: () => getAction("users/options", "USER_OPTIONS"),
  getAllUsers: (filters) =>
    getAction(`users${jsonToQuery(filters)}`, "USER_LIST"),
  getUser: (id) => getAction("users?id=" + id, "SELECTED_USER"),
  updateUser: (id, update) => putAction(`users`, { id, update }, "UPDATE_USER"), //updateUser //should be a PUT action
  addNew: (user) => postAction("users", user, "NEW_USER"), //addUser
  resetResult: () => ({ type: "RESET_PEOPLE_RESULT" }),
  auth: (loginData) => postAction("users/auth", loginData, "LOGIN"),
  getFromToken: (token) => getAction("users/userByToken", "USER_DATA"),
};

export const deviceActions = {
  getList: (plant) =>
    postAction("devices/filters", { plant }, "FULL_DEVICE_LIST"), //getDeviceList //this should be getAction
  getDetail: (id) => getAction(`devices/id?id=${id}`, "DEVICE_DETAIL"),
  getHistory: (id) => getAction(`devices/history?code=${id}`, "DEVICE_HISTORY"),
  allOptions: () => getAction(`devices/fullOptions`, "DEVICE_OPTIONS"),
  createNew: (device) => postAction(`devices`, device, "NEW_DEVICE"),
  resetResult: () => ({ type: "RESET_DEVICE_RESULT" }),
  resetDevice: () => ({ type: "RESET_DEVICE" }),
  updateDevice: (device) => putAction("devices", device, "UPDATE_DEVICE"),

  getFullList: (plant) =>
    getAction(`devices/all?plant=${plant}`, "FULL_DEVICE_LIST"),

  postExcel: (data) => postAction("excel", data, "LOAD_DEVICE_EXCEL"),

  getPartialList: (filters) => {
    filters.plant = "SSN"; // <-- review this. Should be userData.plant or selected plant.
    postAction("devices/filters", filters, "PARTIAL_LIST");
  }, //getPartialDeviceList // should be get action
  getFilters: (plant) =>
    getAction(`devices/filters?plant=${plant || "SSN"}`, "DEVICE_FILTERS"), //getDeviceFilters // <-- review plantCode
  viewDevice: (code) => ({ type: "DEVICE_VIEW", payload: code }), //viewDevice <-- review
  setDevice: (device) => ({ type: "DEVICE_DETAIL", payload: device }), //getDeviceFromList
  listByLine: (lineName) =>
    getAction(`devices/byLine/${lineName}`, "PARTIAL_LIST"), //deviceListByLine
  getByName: (name) => getAction(`devices/byName/${name}`, "PARTIAL_LIST"), //deviceByName
  getOptions: () => getAction("devices/options", "DEVICE_OPTIONS"), //getDeviceOptions
};

export const workOrderActions = {
  getList: (plant, year) =>
    getAction(
      `workorder/list${plant || year ? "?" : ""}${
        plant ? `plant=${plant}` : ""
      }${plant ? "&" : ""}${year ? `year=${year}` : ""}`,
      "ORDER_LIST"
    ),
  callMostRecent: (filters) =>
    postAction(`workorder/mostrecent`, filters, "MOST_RECENT"),
  setDetail: (order) => ({
    type: "ORDER_DETAIL",
    payload: order,
  }),
  resetOrderResult: () => ({
    type: "RESET_ORDER_RESULT",
    payload: {},
  }),
  getWOOptions: () => getAction(`workorder/options`, "GET_WO_OPTIONS"),
  newWorkOrder: (order) => postAction(`workorder`, order, "NEW_ORDER"),
  updateOrder: (code, update) =>
    putAction(`workorder/${code}`, update, "NEW_ORDER"),
  resetNewOrder: () => ({
    type: "NEW_ORDER",
    payload: null,
  }),
  searchWO: (code) => getAction(`workorder/detail/${code}`, "ORDER_DETAIL"),
  resetDetail: () => ({
    type: "ORDER_DETAIL",
    payload: {},
  }),
  getWOList: (conditions) =>
    postAction(`workorder/list`, conditions, "ORDER_LIST"),
  deleteOrder: (code) => deleteAction(`workorder/${code}`, "DELETED_ORDER"),
  newIntervention: (order, data) =>
    postAction(`intervention`, { order: order, ...data }, "ADD_INTERVENTION"),
  updateIntervention: (id, update) =>
    putAction(`intervention`, { id, update }, "UPDATE_INTERVENTION"),
  addCylinderUsage: (intervention, user, gases) =>
    postAction(`cylinders/usages`, { intervention, user, gases }, "ADD_USAGE"),
  deleteCylinderUsage: (intervention, user, usages) =>
    deleteAction(
      `cylinders/usages`,
      { intervention, user, usages },
      "DEL_USAGE"
    ),
};
export const plantActions = {
  getLocations: (plant) =>
    getAction(`servicePoints?plant=${plant}`, "LOCATIONS"),
  createPlant: (body) => postAction("plants", body, "CREATE_PLANT"),
  getPlants: () => getAction(`plants`, "PLANT_LIST"),
  updatePlant: (body) => putAction(`plants/update`, body, "UPDATE_PLANT"),
  deletePlant: (plant) =>
    deleteAction(`plants/delete?code=${plant.code}`, "DELETE_PLANT"),
  resetResult: () => ({ type: "RESET_PLANT_RESULT", payload: {} }),

  createArea: (body) => postAction(`areas`, body, "NEW_AREAS"),
  getAreas: () => getAction(`areas`, "AREA_LIST"),
  updateArea: (body) => putAction("areas", body, "UPDATE_AREA"),
  deleteArea: (area) => deleteAction(`areas?areaId=${area._id}`, "DELETE_AREA"),

  createLine: (body) => postAction(`lines`, body, "NEW_LINES"),
  getLines: () => getAction(`lines`, "LINE_LIST"),
  getLine: (conditions) =>
    getAction(`lines${jsonToQuery(conditions)}`, "LINE_DETAIL"),
  updateLine: (body) => putAction("lines", body, "UPDATE_LINE"),
  deleteLine: (area) => deleteAction(`lines?lineId=${area._id}`, "DELETE_LINE"),

  createSP: (body) => postAction(`servicePoints`, body, "NEW_SP"),
  getSPs: () => getAction(`servicePoints`, "SP_LIST"),
  updateSP: (body) => putAction("servicePoints", body, "UPDATE_SP"),
  deleteSP: (item) =>
    deleteAction(`servicePoints?spId=${item._id || item.id}`, "DELETE_SP"),
  setPlant: (plant) => ({ type: "SELECTED_PLANT", payload: plant }),
};

export const planActions = {
  selectStrategy: (strategy) => ({
    type: "SELECT_STRATEGY",
    payload: strategy,
  }),
  createStrategy: (body) => postAction(`strategies`, body, "NEW_PROGRAM"),
  resetPlanResult: () => ({
    type: "RESET_PLAN_RESULT",
    payload: {},
  }),
  updateStrategy: (data) => putAction(`strategies`, data, "NEW_PROGRAM"),
  getStrategies: (conditions) =>
    getAction(`strategies${jsonToQuery(conditions)}`, "ALL_PROGRAMS"),
  selectTask: (task) => ({
    type: "SELECT_TASK",
    payload: task,
  }),
  dateOrder: (body) => putAction("tasks", body, "UPDATE_DATE"),
  getPlan: (conditions) =>
    getAction(`dates/plan${jsonToQuery(conditions)}`, "GET_PLAN"),
  setDates: (dates) => postAction("dates", dates, "ADD_DATE"),
  getDates: (conditions) =>
    getAction(`dates${jsonToQuery(conditions)}`, "DATES"),
  getPlanDevices: (conditions) =>
    getAction(`tasks${jsonToQuery(conditions)}`, "PLAN_DEVICES"),
  deleteStrategy: (id) =>
    deleteAction(`strategies?id=${id}`, "DELETE_STRATEGIES"),
};

//review all these device actions...
export function getDevicesList(selectedData) {
  return async function (dispatch) {
    if (selectedData.linesName !== "") {
      return fetch(
        `${appConfig.url}/abmdevices/devicelist?line=${selectedData.linesName}&sp=${selectedData.spName}`
      )
        .then((response) => response.json())
        .then((json) => {
          dispatch({
            type: "GET_ALLDEVICES",
            payload: json,
          });
          //return json;
        });
    }
  };
}

// export function getOptionsList() {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/abmdevices/options`)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({
//           type: "GET_ALLOPTIONS",
//           payload: json,
//         });
//       });
//   };
// }

// export function addDevice(device) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/abmdevices/`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(device),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

// export function deleteDevice(device) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/abmdevices/delete`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(device),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

export const getDeviceData = (payload) => {
  return {
    type: "DEVICE_DATA",
    payload: payload,
  };
};

export const resetDeviceData = (payload) => {
  return {
    type: "RESET_DEVICE_DATA",
    payload: payload,
  };
};

// export function updateDevice(device) {
//   return async function (dispatch) {
//     return fetch(`${appConfig.url}/abmdevices/update`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(device),
//     })
//       .then((response) => response.json())
//       .then((json) => {
//         return json;
//       });
//   };
// }

//check if this equals to peopleActions.getAllUsers()
export const getEmpleados = () => getAction("users", "GET_WORKERS");

//replace this
export function searchWODevice(devCode) {
  return async function (dispatch) {
    return fetch(`${appConfig.url}/devices/filters`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
