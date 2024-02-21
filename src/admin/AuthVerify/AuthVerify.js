import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  let location = useLocation();
  let history = useHistory()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));

    if (user) {
      // history.push("/logout")
      // window.location.reload()
      console.log("logout sidde--")

      const decodedJwt = parseJwt(user.accessToken);
    //   console.log(decodedJwt,"decodedJwt--")
    //   console.log(props.logOut,"props.logOut--")
    //   console.log(decodedJwt.exp * 1000 < Date.now(),"decodedJwt.exp * 1000 < Date.now()")
      if (decodedJwt.exp * 1000 < Date.now()) {
        // props.logOut();
        history.push("/logout")
      }
    }
  }, [location, props]);

  return ;
};

export default AuthVerify