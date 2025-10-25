import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "./actions/StoreActions";
import "./App.css";
import InnerLayout from "./components/Layout/InnerLayout";
import AdminPanel from "./pages/Admin/AdminPanel";
import AdminCylinders from "./pages/Admin/Cylinders";
import DeviceAdmin from "./pages/Admin/Devices";
import { LoadExcel } from "./pages/Admin/LoadExcel";
import { LoadFrequencies } from "./pages/Admin/LoadFrequencies";
import AdminPlan from "./pages/Admin/Plan";
import AdminPlants from "./pages/Admin/Plants";
import AdminUsers from "./pages/Admin/Users";
import Device from "./pages/Device";
import Landing from "./pages/Landing";
import Monitoring from "./pages/Monitoring";
import NotFound from "./pages/NotFound";
import Panel from "./pages/Panel";
import Plan from "./pages/Plan";
import WorkOrder from "./pages/WorkOrder";
import WorkOrders from "./pages/WorkOrders";

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

  useEffect(() => {
    console.log(
      "%c🚀 Aplicación web desarrollada por Leo Monay 🚀",
      "color: #00ff00; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 10px; border-radius: 10px;"
    );
    console.log(
      "%c💼 Visita mi portfolio: https://leomonay.github.io/",
      "color: #ffffff; font-size: 16px; font-weight: bold; background: linear-gradient(45deg, #667eea, #764ba2); padding: 8px; border-radius: 8px; margin-top: 5px;"
    );
    console.log(
      "%c🔗 GitHub: https://github.com/leomonay",
      "color: #ffffff; font-size: 14px; background: #333; padding: 6px; border-radius: 6px; margin-top: 3px;"
    );
  }, []);

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
                <InnerLayout>
                  <Panel />
                </InnerLayout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots"}
              element={
                <InnerLayout>
                  <WorkOrders />
                </InnerLayout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots/new"}
              element={
                <InnerLayout>
                  <WorkOrder />
                </InnerLayout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots/detail/:orderCode"}
              element={
                <InnerLayout>
                  <WorkOrder />
                </InnerLayout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/equipos"}
              element={
                <InnerLayout>
                  <Device />
                </InnerLayout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/equipos/:code"}
              element={
                <InnerLayout>
                  <Device />
                </InnerLayout>
              }
            />
          )}
          {access.isLogged && (
            <Route
              exact
              path={"/ots/edit/:otCode"}
              element={
                <InnerLayout>
                  <WorkOrder />
                </InnerLayout>
              }
            />
          )}
          <Route
            exact
            path={"/plan"}
            element={
              <InnerLayout>
                <Plan />
              </InnerLayout>
            }
          />
          {access.isAdmin && (
            <Route
              exact
              path={"/admin"}
              element={
                <InnerLayout>
                  <AdminPanel />
                </InnerLayout>
              }
            />
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/:selected"}
              element={
                <InnerLayout>
                  <AdminPanel />
                </InnerLayout>
              }
            />
          )}
          <Route
            exact
            path={"/plan"}
            element={
              <InnerLayout>
                <Plan />
              </InnerLayout>
            }
          />
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/usuarios"}
              element={
                <InnerLayout>
                  <AdminUsers />
                </InnerLayout>
              }
            />
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/equipos"}
              element={
                <InnerLayout>
                  <DeviceAdmin />
                </InnerLayout>
              }
            />
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/plantas"}
              element={
                <InnerLayout>
                  <AdminPlants />
                </InnerLayout>
              }
            />
          )}
          {access.isAdmin && (
            <>
              <Route
                path="/admin/plan"
                element={
                  <InnerLayout>
                    <AdminPlan />
                  </InnerLayout>
                }
              />
              <Route
                path="/admin/plan/:tab"
                element={
                  <InnerLayout>
                    <AdminPlan />
                  </InnerLayout>
                }
              />
            </>
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/garrafas"}
              element={
                <InnerLayout>
                  <AdminCylinders />
                </InnerLayout>
              }
            />
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/monitoreo"}
              element={
                <InnerLayout>
                  <Monitoring />
                </InnerLayout>
              }
            />
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/carga_excel"}
              element={
                <InnerLayout>
                  <LoadExcel />
                </InnerLayout>
              }
            />
          )}
          {access.isAdmin && (
            <Route
              exact
              path={"/admin/carga_frecuencias"}
              element={
                <InnerLayout>
                  <LoadFrequencies />
                </InnerLayout>
              }
            />
          )}
          <Route exact path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
}

export default App;
