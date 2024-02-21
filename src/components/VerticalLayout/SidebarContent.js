import PropTypes from "prop-types"
import React, { useEffect, useRef } from "react"
import { ImNewspaper } from "react-icons/im"
import { cilMoney } from "@coreui/icons"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"
import { GET_BROWSE_CATEGORY } from "admin/Api/api"
//i18n
import { withTranslation } from "react-i18next"
import axios from "axios"
import { useState } from "react"
import { useProvider } from "admin/context/ProviderApp"
import { toast } from "react-toastify"
import { FaBuromobelexperte } from "react-icons/fa"
// import { PaymentMethods } from "admin/PaymentMethods/PaymentMethods";

const SidebarContent = props => {
  // console.log(props,"props sidebar")
  const { layers } = props
  const ref = useRef()

  const { layerData, setLayerData } = useProvider()
  // console.log(layers, "layers- from sidebar content")
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        // console.log(items[i].pathname,"items[i].pathname")
        // console.log(pathName,"pathname")

        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  const handleLayers = (_layerName, _layerId) => {
    try {
      console.log(_layerName, _layerId, "_layerName,_layerId sidebar")
      let data = { layerName: _layerName, layerId: _layerId }
      localStorage.setItem("layerData", JSON.stringify(data))

      setLayerData(prev => ({
        ...prev,
        layerName: _layerName,
        layerId: _layerId,
      }))
    } catch (error) {
      toast.error(error.message ? error.message : error)
      console.log(error, "error handle layer ")
    }
  }

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("DashBoard")} </li>
            <li>
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li className="menu-title">{props.t("Features")}</li>

            <li>
              <Link to="/users">
                <i className="fa fa-user"></i>
                <span>{props.t("Users")}</span>
              </Link>
            </li>
            <li>
              <Link to="/" className="has-arrow">
                <i className="fas fa-th-large"></i>
                <span>{props.t("Minting Templates")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/view-minting-templates">
                    <span>{props.t("View Templates")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/add-minting-templates">
                    <span>{props.t("Add Templates")}</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link onClick={() => {}} to="/nft-templates">
                {/* <FaBuromobelexperte/> */}
                <i className="fas fa-th-large"></i>
                <span>{props.t("NFT Templates")}</span>
              </Link>
            </li>

            <li>
              <Link to="/browseImages">
                <i className="fas fa-images"></i>
                <span>{props.t("Browse-Images")}</span>
              </Link>
            </li>
            <li>
              <Link to="/active-packages" className="">
                <i className="fab fa-dropbox"></i>
                <span>{props.t("Plans-Packages")}</span>
              </Link>
              {/* <ul className="sub-menu">
                <li>
                  <Link to="/active">
                    <span>{props.t("Active Package")}</span>
                  </Link>
                </li>
              </ul> */}
            </li>
            <li>
              <Link to="/" className="has-arrow">
                <i className="mdi mdi-newspaper-variant-outline"></i>
                <span>{props.t("Features")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/features">
                    <span>{props.t("Feature-List")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/feature-types">
                    <span>{props.t("Feature-Type")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/" className="has-arrow">
                <i className="fas fa-money-check-alt"></i>

                <span>{props.t("Payment Methods")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/add-payment-method">
                    <span>{props.t("Add")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/view-payment-method">
                    <span>{props.t("View")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{props.t("Settings")}</li>

            <li>
              <Link to="/profile-setting" className="">
                <i className="fa fa-user"></i>

                <span>{props.t("Profile Settings")}</span>
              </Link>
            </li>
            <li>
              <Link to="/logout" className="">
              <i className="bx bx-power-off"></i>

              <span>{props.t("Logout")}</span>

              </Link>
            </li>

            {/* <li className="logout_button testingClass">
             
              <Link
                className=""
                to="/logout"
                style={{
                  padding: "7px 0px",
                  textAlign: "start",
                  paddingLeft: "20px",
                }}
              >
                <i className="bx bx-power-off"></i>
                <span>{props.t("Logout")}</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
