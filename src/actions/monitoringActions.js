const baseURL = "http://tecnoclima.dyndns.org:4000/server/ajax";
// control.php?op=listar
// op=versensor

export function monitorAction(data) {
  fetch(`${baseURL}/${data.endpoint}`, {
    method: data.method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data.body ? JSON.stringify(data.body) : undefined,
  })
    .then((response) => response.json())
    // .then((json) => dispatch({ type: data.type, payload: json }))
    .then((json) => data.callback(json))
    .catch((e) => console.error(e));
}

// const getAction = (endpoint, callback) =>
//   monitorAction({ endpoint, method: "GET", callback });
const postAction = (endpoint, body, callback) =>
  monitorAction({ endpoint, method: "POST", body, callback });
// const putAction = (endpoint, body, callback) =>
//   monitorAction({ endpoint, method: "PUT", body, callback });
// const deleteAction = (endpoint, callback) =>
//   monitorAction({ endpoint, method: "DELETE", callback });

export const monitorActions = {
  list: (callback) =>
    postAction("/control.php?op=listar", { id: "10" }, callback),
  deviceDetail: (body, callback) =>
    postAction(
      "control.php?op=VerEstadoSensores",
      { ...body, usuario: "10" },
      callback
    ),
};
