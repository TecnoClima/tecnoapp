const serverUrl = {
  dev: "http://localhost:3004/v1",
  // test: "http://localhost:3002/v1",
  test: "http://200.105.69.248:3002/v1",
  prod: "http://200.105.69.248:3001/v1",
};

const appConfig = {
  url: serverUrl[process.env.REACT_APP_ENV],
  plantConfig: {
    code: "SSN",
  },
};

//line to check if gitignore worked. 05/09/22

export { appConfig };
