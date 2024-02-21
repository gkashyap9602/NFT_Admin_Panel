import React, { useEffect, useState, useRef } from "react"
import { CCard, CCardBody, CCol, CFormSelect, CRow } from "@coreui/react"
import { Button } from "reactstrap"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { Loader } from "admin/Loader/Loader"
import "./UpdateUser.scss"


import { GET_PROFILE, UPDATE_PROFIE, API_BASE_URL } from "admin/Api/api"
import axios from "axios"
import { Nav, Navbar } from "react-bootstrap"

import { EditUser } from "../StepsUserEdit/EditUser"
import { StepPackageUpdate } from "../StepsUserEdit/StepPackageUpdate"

export const UpdateUser = () => {
  // const { loader, setLoader } = useProvider()

  const [loader, setLoader] = useState(true)

  const [image, setImage] = useState({
    blob: null,
    src: "",
  })
  const [currentTab, setCurrentTab] = useState(0)
  const [viewInfo, setViewInfo] = useState({
    status: false,
    id: ""
  })

  const userEditTabs = [
    <EditUser key={0} />,
    <StepPackageUpdate key={2} />,


  ]

  // console.log(userEditTabs,"userEditTabs-- update user side ")

  const handleImageChange = files => {
    const extn = ["image/jpg", "image/png", "image/jpeg"]
    const [file] = files
    if (file && extn.includes(file.type)) {
      if (file.size <= 5242880) {
        setImage({ blob: file, src: window.URL.createObjectURL(file) })
      } else {
        toast.error("File too large")
      }
    } else {
      toast.error(
        "Please select a valid image file(only jpg, png and jpeg images are allowed)"
      )
    }
  }
  const ProfileSchema = Yup.object().shape({
    userName: Yup.string()
      .min(4, "Too Short!")
      .max(20, "Too Long!")
      .required("Please enter your  name"),

  })
  const [user, setUser] = useState({
    userName: "",
    email: "",
  })

  const authUser = JSON.parse(localStorage.getItem("authUser"))
  const token = authUser.accessToken

  const getAdminDetails = async () => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    const imageBaseUrl = `${API_BASE_URL}/uploads/common/`
    await axios
      .get(`${GET_PROFILE}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(res => {
        // console.log(res, "reponse getAdmin Details side ")

        const { userName, email, profile } = res.data.data

        setUser({ userName, email })
        profile &&
          profile !== null &&
          setImage({
            // blob: null,
            src: `${imageBaseUrl}/${profile}`,
          })
      })

      .catch(err => {
        // console.log(err, "error add layer side  ")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setLoader(false)
      })
  }

  useEffect(() => {
    getAdminDetails()
    // eslint-disable-next-line
  }, [])

  function appendData(values) {
    const formValues = { ...values }
    const formData = new FormData()
    for (const value in formValues) {
      formData.append(value, formValues[value])
    }
    return formData
  }

  const updateProfile = async values => {
    try {
      setLoader(true)
      // console.log(values, "values update Profile")
      let formdata = new FormData()
      formdata.append("userName", values.userName)

      if (image.blob) {
        formdata.append("profile", image.blob)
      }
      let user = JSON.parse(localStorage.getItem("authUser"))

      const userSaveResponse = await axios.post(`${UPDATE_PROFIE}`, formdata, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })

      // console.log(userSaveResponse, "userSaveResponse--update side ")
      if (userSaveResponse.status === 200) {
        toast.success(userSaveResponse.data.message)
        getAdminDetails()
      } else {
        throw new Error(userSaveResponse.error)
      }
    } catch (err) {
      // console.log(err, "error update profile side ")
      toast.error(
        err.response ? err.response.data.error : "Something went wrong"
      )
      // changeApiStatus(false, err.response ? err.response.data.error : err.message)
    } finally {
      setLoader(false)
    }
  }
  const uploadRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState({
    name: "",
  })

  useEffect(() => {
    setSelectedTab({
      name: "User Profile",
    })
  }, [])

  const tabs = [
    {
      name: "User Profile",
    },

    {
      name: "Package",
    },


  ]
  // console.log(selectedTab, "selectedTab--")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <div className="page-content">
        <Nav className="" variant="tabs" defaultActiveKey="/home">
          {/* {selectedTab.name==="User Profile"?} */}
          {tabs.map((tab, index) => (
            <>
              {/* {console.log(tab.name,"tabname")} */}
              {currentTab === index ? (
                <Nav.Item>
                  <Nav.Link
                    active
                    onClick={() => {
                      //   setSelectedTab({
                      //     name: tab.name,
                      //   })
                      setCurrentTab(index)
                    }}
                    href="#"
                    eventKey={`link-${index}`}
                  >
                    {tab.name}
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Item>
                  <Nav.Link
                    onClick={() => {
                      //   setSelectedTab({
                      //     name: tab.name,
                      //   })
                      setCurrentTab(index)
                    }}
                    href="#"
                    eventKey={`link-${index}`}
                  >
                    {tab.name}
                  </Nav.Link>
                </Nav.Item>
              )}
            </>
          ))}
        </Nav>
        {userEditTabs[currentTab]}
      </div>
    </>
  )
}
