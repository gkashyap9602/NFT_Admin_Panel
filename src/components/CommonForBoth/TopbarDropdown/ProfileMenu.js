import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import axios from "axios"
import { toastify } from "react-toastify"
import { GET_PROFILE, API_BASE_URL } from "admin/Api/api"

const ProfileMenu = props => {
  const [menu, setMenu] = useState(false)
  const [userName, setUserName] = useState("Admin")
  const [image, setImage] = useState({
    blob: null,
    src: "",
  })

  const getAdminDetails = async () => {
    // setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    const imageBaseUrl = `${API_BASE_URL}/uploads/common/`
    await axios
      .get(`${GET_PROFILE}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(res => {
        // console.log(res, "reponse getAdmin Details side ")

        const { userName, email, profile } = res.data.data

        setUserName(userName)
        profile &&
          profile !== null &&
          setImage({
            // blob: null,
            src: `${imageBaseUrl}/${profile}`,
          })
      })

      .catch(err => {
        // console.log(err, "error add layer side  ")
        // toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        // setLoader(false)
      })
  }

  useEffect(() => {
    getAdminDetails()
    // eslint-disable-next-line
  }, [])
  
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(prev => !prev)}
        className="d-inline-block"
      >
        <DropdownToggle
          caret
          className="btn header-item "
          // id="page-header-user-dropdown"
          tag="span"
        >
          <span style={{zIndex: "-10", position: "relative"}}>
            <img
              className="rounded-circle header-profile-user"
              // src={image.src ? image.src : user1}
              src={image.src}
              style={{height: "35px", width: "35px", objectFit: "cover" }}
              alt=""
            />
            <span className="d-none d-xl-inline-block ms-2 me-1">{`Welcome ${userName}`}</span>
            {/* <i className="mdi mdi-chevron-down d-none d-xl-inline-block" /> */}
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/profile-setting">
            <DropdownItem tag="a" href="/profile">
              {" "}
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {props.t("Profile")}{" "}
            </DropdownItem>
          </Link>

          {/* <DropdownItem tag="a" href="/crypto-wallet">
            <i className="bx bx-wallet font-size-16 align-middle me-1" />
            {props.t("My Wallet")}
          </DropdownItem> */}
          {/* <DropdownItem tag="a" href="#">
            <span className="badge bg-success float-end">11</span>
            <i className="bx bx-wrench font-size-16 align-middle me-1" />
            {props.t("Settings")}
          </DropdownItem> */}
          {/* <DropdownItem tag="a" href="auth-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {props.t("Lock screen")}
          </DropdownItem> */}
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
