import PropTypes from 'prop-types';
import React,{useState,useEffect} from "react";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "../src/admin/style.css"
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";
//context 
import { useProvider } from 'admin/context/ProviderApp';
// Import all middleware
import Authmiddleware from "./routes/route";
// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import AuthVerify from 'admin/AuthVerify/AuthVerify';
import fakeBackend from "./helpers/AuthType/fakeBackend"
//a
// Activating fake backend
fakeBackend()

const App = (props) => {
  const {layers} = useProvider();
  // console.log(layers,"layers App js----")
  function getLayout() {
    let layoutCls = VerticalLayout;
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }
// console.log(layers,"layers app js")
  const Layout = getLayout();
  return (
    <>
      <ToastContainer  progressClassName="toastProgress" bodyClassName="toastBody"/>
      {/* <AuthVerify logOut = {logoutUser}/> */}
      <Router >
        <Switch>
          {publicRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}

          {authProtectedRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
          

        </Switch>
      </Router>

    </>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  };
};

      export default connect(mapStateToProps, null)(App);
