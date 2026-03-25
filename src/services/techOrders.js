import { fetchData } from "../actions/StoreActions";

const api = (endpoint, method, body) =>
  fetchData({ endpoint, method, body });

export const techOrdersService = {
  templates: {
    list: () => api("tasktemplate", "GET"),
    get: (id) => api(`tasktemplate/${id}`, "GET"),
    create: (data) => api("tasktemplate", "POST", data),
    update: (id, data) => api(`tasktemplate/${id}`, "PUT", data),
    delete: (id) => api(`tasktemplate/${id}`, "DELETE"),
  },
  groupParts: {
    list: () => api("grouppart", "GET"),
    create: (data) => api("grouppart", "POST", data),
    update: (id, data) => api(`grouppart/${id}`, "PUT", data),
    delete: (id) => api(`grouppart/${id}`, "DELETE"),
  },
  techTasks: {
    list: () => api("techtask", "GET"),
    create: (data) => api("techtask", "POST", data),
    update: (id, data) => api(`techtask/${id}`, "PUT", data),
    delete: (id) => api(`techtask/${id}`, "DELETE"),
  },
  taskOptions: {
    list: () => api("taskoption", "GET"),
    create: (data) => api("taskoption", "POST", data),
    update: (id, data) => api(`taskoption/${id}`, "PUT", data),
    delete: (id) => api(`taskoption/${id}`, "DELETE"),
  },
};
