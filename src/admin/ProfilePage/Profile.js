import React, { useEffect, useState, useRef } from "react"
import { CCard, CCardBody, CCol, CRow } from "@coreui/react"
import { Button } from "reactstrap"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { Loader } from "admin/Loader/Loader"

import Dropzone from "react-dropzone"

import { ChangePassword } from "./ChangePassword"
import { GET_PROFILE, UPDATE_PROFIE, API_BASE_URL } from "admin/Api/api"
import axios from "axios"


export const Profile = () => {
  // document.title = "Profile Settings"

    // const {loader,setLoader} = useProvider()
    const [loader,setLoader] = useState(true)


  const [image, setImage] = useState({
    blob: null,
    src: "",
  })

  const handleImageChange = files => {
    const extn = ["image/jpg", "image/png", "image/jpeg"]
    const [file] = files
    if (file && extn.includes(file.type)) {
      //   changeApiStatus(false, '')
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
      .finally(()=>{
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

      const userSaveResponse = await axios.post(
        `${UPDATE_PROFIE}`,
        formdata,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      )

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
    }finally{
        setLoader(false)
        
    }
  }
  const uploadRef = useRef(null)

  return loader?(
    <>
    <Loader/>
    </>
  ): (
    <>
      <CRow>
        <CCol md={12}>
          <CCard className="col-xl-12 col-lg-12 mx-auto mb-4 rounded shadow-md p-2 mt-5">
            <div className=" text-center bg-white p-3 pb-0">
              <h5 style={{ fontSize: "18px" }} className="mb-0 mt-4">Update Profile</h5>
              {/* <p className="mb-2 text-medium-emphasis">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Est laboriosam, dolorem hic
                perspiciatis aspernatur atque.
              </p> */}
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
                      <div className="row">
                        <div className="col-md-8">
                          <div className="mb-3">
                            <label htmlFor="firstName">User Name: </label>
                            <Field
                              //   disabled={apiStatus.inProgress}
                              name="userName"
                              id="username"
                              placeholder="Enter your name"
                              className="form-control"
                            />
                            {errors.userName && touched.userName ? (
                              <div className="text-danger">
                                {errors.userName}
                              </div>
                            ) : null}
                          </div>

                          <div className="mb-3">
                          </div>
                          <div className="mb-3">
                            
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email">Email: </label>
                            {/* <Field disabled name="email" id="email" className="form-control" /> */}
                            <Field
                              disabled
                              name="email"
                              id="email"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label>
                            <strong>Profile Image :</strong>{" "}
                          </label>
                          <div className="text-center">
                            <div className="mb-3 p-0 dragdrop-container">
                              <input
                                ref={uploadRef}
                                // disabled={apiStatus.inProgress}
                                id="upload"
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={e =>
                                  handleImageChange(e.target.files)
                                }
                              />
                              {image.src ? (
                                <img
                                  className="banner-img"
                                  src={image.src ? image.src : ""}
                                  alt=""
                                  onClick={() => {
                                    uploadRef.current.click()
                                  }}
                                />
                              ) : (
                                <div className="drag-n-drop-container">
                                  <div>
                                    <Dropzone
                                      accept="image/*"
                                      multiple={false}
                                      onDrop={acceptedFiles => {
                                        handleImageChange(acceptedFiles)
                                      }}
                                    >
                                      {({
                                        getRootProps,
                                        getInputProps,
                                        isDragActive,
                                      }) => (
                                        <section>
                                          <div
                                            className="drop-area"
                                            {...getRootProps()}
                                          >
                                            <img
                                              width={60}
                                              src={image.src ? image.src : ""}
                                              alt=""
                                            />
                                            <input
                                              {...getInputProps()}
                                              accept="image/*"
                                              multiple={false}
                                            />

                                            {isDragActive ? (
                                              <div>
                                                Drop your image file here
                                              </div>
                                            ) : (
                                              <p>
                                                Drag n drop image file here, or
                                                click to select <br />
                                                <small className="text-center ">
                                                  <strong>
                                                    Supported files:
                                                  </strong>{" "}
                                                  jpeg, jpg, png. | Will be
                                                  resized to: 1920x1080 px.
                                                </small>
                                              </p>
                                            )}
                                          </div>
                                        </section>
                                      )}
                                    </Dropzone>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="fw-bold">
                            Note:
                            <span className="text-danger mx-2">
                              Supported image formats are:&nbsp;jpg, png and
                              jpeg only
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          className={`btn btn-primary`}
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <ChangePassword />
      </CRow>
    </>
  )
}
