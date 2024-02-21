import React, { useEffect, useState, useRef } from "react"
import { CCard, CCardBody, CCol, CFormSelect, CRow } from "@coreui/react"
import { Button } from "reactstrap"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { Loader } from "admin/Loader/Loader"

import { API_BASE_URL, GET_USER_DETAILS } from "admin/Api/api"
import axios from "axios"

import { useParams } from "react-router-dom"

export const EditUser = () => {
  const { id } = useParams()

  const [loader, setLoader] = useState(true)

  const [image, setImage] = useState({
    blob: null,
    src: "",
  })

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

  const [userDetails, setUserDetails] = useState("")

  const getUserDetails = async () => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))
    await axios
      .get(`${GET_USER_DETAILS}?userId=${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(res => {
        // console.log(res, "reponse user Details side ")
        setUserDetails(res.data.data)
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
    getUserDetails()
    // eslint-disable-next-line
  }, [])

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
        //   changeApiStatus(false, '')
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

  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <>
        <CRow>
          <CCol md={12}>
            <CCard className="col-xl-12 col-lg-12 mx-auto mb-0 rounded shadow-md p-3 mt-1">
              <div className="bg-white p-0 pb-0">
                <h5 className="mb-0 mt-4" style={{ fontSize: "20px" }}>
                  Update User
                </h5>
              </div>
              <CCardBody>
                <div className="">
                  <Formik
                    initialValues={user}
                    enableReinitialize
                    validationSchema={ProfileSchema}
                    onSubmit={updateProfile}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label htmlFor="email">Email: </label>
                              {/* <Field disabled name="email" id="email" className="form-control" /> */}
                              <Field
                                disabled
                                name="UserEmail"
                                value={userDetails.email}
                                id="email"
                                className="form-control"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label htmlFor="email">Mobile Number: </label>
                              {/* <Field disabled name="email" id="email" className="form-control" /> */}
                              <Field
                                disabled
                                name="UserEmail"
                                value={userDetails.phoneNumber}
                                id="email"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div className="text-center">
                              <button
                                className={`btn btn-primary`}
                                type="submit"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    </>
  )
}
