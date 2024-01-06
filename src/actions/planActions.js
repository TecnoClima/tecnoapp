import { appConfig } from "../apiConfig";
const token = "Bearer " + localStorage.getItem("tecnoToken");
const fetchURL = appConfig.url;

export function setDeviceStrategy(planDevices) {
  return async function (dispatch) {
    return fetch(`${fetchURL}/tasks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
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
