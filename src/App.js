import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Landing from "./pages/Landing";
import Layout from "./layout/index";
import Panel from "./pages/Panel";
import Plan from "./pages/Plan";
import WorkOrders from "./pages/WorkOrders";
import { useDispatch, useSelector } from "react-redux";
import AdminPanel from "./pages/Admin/AdminPanel";
import WorkOrder from "./pages/WorkOrder";
import Device from "./pages/Device";
import { peopleActions, planActions } from "./actions/StoreActions";
import NotFound from "./pages/NotFound";

function App() {
  const { userData } = useSelector((state) => state.people);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("tecnoToken");
    token ? dispatch(peopleActions.getFromToken()) : setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    userData &&
      setAccess({
        isLogged: !!userData.user,
        isAdmin: userData.access === "Admin",
      });
  }, [dispatch, userData]);

  useEffect(
    () => Object.keys(access).length === 2 && setLoading(false),
    [access]
  );

  if (loading) return <div className="waiting"></div>;
  if (!loading)
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} hideNavBar={true} />
          {access.isLogged && (
            <Route
              exact
              path={"/panel"}
              element={
                <Layout>
                  <Panel />
                </Layout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots"}
              element={
                <Layout>
                  <WorkOrders />
                </Layout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots/new"}
              element={
                <Layout>
                  <WorkOrder />
                </Layout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots/detail/:orderCode"}
              element={
                <Layout>
                  <WorkOrder />
                </Layout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/equipos"}
              element={
                <Layout>
                  <Device />
                </Layout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/equipos/:code"}
              element={
                <Layout>
                  <Device />
                </Layout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots/edit/:otCode"}
              element={
                <Layout>
                  <WorkOrder />
                </Layout>
              }
            />
          )}
          <Route
            exact
            path={"/plan"}
            element={
              <Layout>
                <Plan />
              </Layout>
            }
          />
          {access.isAdmin && (
            <Route
              exact
              path={"/admin"}
              element={
                <Layout>
                  <AdminPanel />
                </Layout>
              }
            />
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/:selected"}
              element={
                <Layout>
                  <AdminPanel />
                </Layout>
              }
            />
          )}
          <Route
            exact
            path={"/plan"}
            element={
              <Layout>
                <Plan />
              </Layout>
            }
          />
          <Route exact path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
}

export default App;
