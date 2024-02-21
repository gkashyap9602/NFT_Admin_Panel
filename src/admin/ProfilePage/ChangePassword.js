import React, { useState } from "react"
import { CCard, CCardBody, CCol } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { Button } from "reactstrap"
import axios from "axios"
import { toast } from "react-toastify"
// import style from ""
import style from "./profile.module.css"
import { CHANGE_PASSWORD } from "admin/Api/api"

// import { changePassword } from 'src/services/userService'
// import { fireToast } from 'src/common/toast'
// import { RemoveFromLocalStorage, UserDataKey } from 'src/common/utility'
// import Button from 'src/components/common/CommonButton/Button'

export const ChangePassword = () => {
  const SignupSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(4, "Too Short!")
      .max(80, "Too Long!")
      .required("Please enter your old password"),
    newPassword: Yup.string()
      .min(4, "Too Short!")
      .max(80, "Too Long!")
      .required("Please enter your new password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Please confirm your new password"),
  })
  const [passwordType, setPasswordType] = useState("password")
  const [passwordType2, setPasswordType2] = useState("password")
  const [passwordType3, setPasswordType3] = useState("password")

  const [inputActive, setInputActive] = useState(0)
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text")
      return
    }
    setPasswordType("password")
  }
  const togglePassword2 = () => {
    if (passwordType2 === "password") {
      setPasswordType2("text")
      return
    }
    setPasswordType2("password")
  }
  const togglePassword3 = () => {
    if (passwordType3 === "password") {
      setPasswordType3("text")
      return
    }
    setPasswordType3("password")
  }
 

  const authUser = JSON.parse(localStorage.getItem("authUser"))
  const token = authUser.accessToken

  const changePassword = values => {

    axios
      .post(`${CHANGE_PASSWORD}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(result => {
        toast.success(result.data.message)
      })
      .catch(err => {
     
        toast.error(err.response ? err.response.data.error : err)
        // toast.error("Already Updated!!")
      })
    // setLoader(false)
  }

  return (
    <>
      <CCol md={12}>
        <CCard className="col-xl-12 col-lg-12 mx-auto mb-5 rounded shadow-md p-2">
          <div className="text-center bg-white p-3 pb-0">
            <h5 style={{ fontSize: "18px" }} className="mb-0">
              Change Password
            </h5>
           
          </div>
          <CCardBody>
            <div className="">
              <Formik
                initialValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                enableReinitialize
                validationSchema={SignupSchema}
                onSubmit={changePassword}
              >
                {({ errors, touched }) => (
                  <Form>
                  <div className="inputChangePass">
                    <div className="mb-3">
                      <label htmlFor="firstName">Old Password: </label>
                      <div className="position-relative">
                        <Field
                          type={passwordType}
                          // disabled={apiStatus.inProgress}
                          name="oldPassword"
                          id="oldPassword"
                          placeholder="Enter your old password"
                          className="form-control"
                        />
                        <div
                          style={{ right: "0", top: "0" }}
                          className="position-absolute"
                        >
                          <span
                            style={{ padding: "9px", marginRight: "4px" }}
                            className={`${style.passwordEye}`}
                            type="button"
                            onClick={() => {
                              togglePassword()
                            }}
                          >
                            {passwordType === "password" ? (
                              <i
                                className={`${style.passwordEyeBefore} fas fa-eye-slash`}
                              ></i>
                            ) : (
                              <i
                                className={`${style.passwordEyeAfter} fas fa-eye`}
                              ></i>
                            )}
                          </span>
                        </div>
                      </div>
                      {errors.oldPassword && touched.oldPassword ? (
                        <div className="text-danger">{errors.oldPassword}</div>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="wallet_address">New Password: </label>

                      <div className="position-relative">
                        <Field
                          type={passwordType2}
                          // disabled={apiStatus.inProgress}
                          name="newPassword"
                          placeholder="Enter your new password"
                          id="newPassword"
                          className="form-control"
                          onPaste={e => e.preventDefault()}
                        />
                        <div
                          style={{ right: "0", top: "0" }}
                          className="position-absolute"
                        >
                          <span
                            style={{ padding: "9px", marginRight: "4px" }}
                            className={`${style.passwordEye}`}
                            type="button"
                            onClick={() => {
                              togglePassword2()
                            }}
                          >
                            {passwordType2 === "password" ? (
                              <i
                                className={`${style.passwordEyeBefore} fas fa-eye-slash`}
                              ></i>
                            ) : (
                              <i
                                className={`${style.passwordEyeAfter} fas fa-eye`}
                              ></i>
                            )}
                          </span>
                        </div>
                      </div>
                      {errors.newPassword && touched.newPassword ? (
                        <div className="text-danger">{errors.newPassword}</div>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="wallet_address">Confirm Password: </label>
                      <div className="position-relative">
                        <Field
                          type={passwordType3}
                          // disabled={apiStatus.inProgress}
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="Confirm password"
                          className="form-control"
                          onPaste={e => e.preventDefault()}
                        />
                        <div
                          style={{ right: "0", top: "0" }}
                          className="position-absolute"
                        >
                          <span
                            style={{ padding: "9px", marginRight: "4px" }}
                            className={`${style.passwordEye}`}
                            type="button"
                            onClick={() => {
                              togglePassword3()
                            }}
                          >
                            {passwordType3 === "password" ? (
                              <i
                                className={`${style.passwordEyeBefore} fas fa-eye-slash`}
                              ></i>
                            ) : (
                              <i
                                className={`${style.passwordEyeAfter} fas fa-eye`}
                              ></i>
                            )}
                          </span>
                        </div>
                      </div>
                      {errors.confirmPassword && touched.confirmPassword ? (
                        <div className="text-danger">
                          {errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>
                    <div
                      className="text-center"
                      style={{ marginBottom: "0px" }}
                    >
                      <button
                        className={`btn btn-primary`}
                        type="submit"
                      >
                        Update Password
                      </button>
                    </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  )
}
