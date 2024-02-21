import React, { useState, useRef, useEffect } from "react"
import { CCard, CCardBody, CCol, CRow, CFormCheck } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import { Row, Col } from "reactstrap"
import Dropzone from "react-dropzone"
import cloud from "../../../assets/cloud.svg"
import upload1 from "../../../assets/upload3.webp"
import "./addTemplate.scss"
import * as Yup from "yup"
// import {Toastco}
import { toast } from "react-toastify"
// import "./addTemplate.scss"
import { changeApiStatus } from "admin/Common/utility"
// import tempImg from "../../assets/temp.png"
import { ADD_MINTING_TEMPLATE } from "admin/Api/api"
import axios from "axios"
import { useProvider } from "admin/context/ProviderApp"
import { useHistory } from "react-router-dom"
import { Loader } from "admin/Loader/Loader"

export const AddMintingTemplate = () => {
  const history = useHistory()
  const { addMintTemplate, setAddMintTemplate } = useProvider()
  const SignupSchema = Yup.object().shape({
    templateName: Yup.string().required("Please enter custom template name"),
  })

  const [data, setData] = useState({
    templateName: "",
  })

  const [loader, setLoader] = useState(false)
  const uploadRef = useRef(null)
  const [image, setImage] = useState({
    blob: null,
    src: "",
  })

  const handleImageChange = files => {
    const [file] = files
    if (file && file.type.includes("image")) {
      if (file.size > 5 * 1048576) {
        toast.error("File Size Is Too Large Please Select Image Under 5Mb")
        return
      }
      setImage({ blob: file, src: window.URL.createObjectURL(file) })
    } else {
      toast.error("Please select a valid image file")
      // changeApiStatus(false, 'Please select a valid image file')
      // fireToast('error', 'Please select a valid image file')
    }
  }
  const onSubmit = async values => {
    try {
      setLoader(true)

      let formdata = new FormData()

      formdata.append("templateName", values.templateName)

      if (!image.src) {
        toast.error("Please select any image")
        return
      }
      formdata.append("templateImage", image.blob)

      let user = JSON.parse(localStorage.getItem("authUser"))
      const response = await axios.post(`${ADD_MINTING_TEMPLATE}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      // console.log(response, "response add mint temp")

      if (response.status === 200) {
        // console.log(values, "values3")
        setAddMintTemplate(true)
        toast.success(response.data.message)
        history.push("/view-minting-templates")
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      // console.log(err,"error add mint template side ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }

  // console.log(image, "image--template")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <div className="page-content">
        <div className="div1 text-end mb-3  d-flex justify-content-between align-items-center">
          <h5 className="mb-0" style={{ fontSize: "18px" }}>
            Add Minting Templates
          </h5>

          <button
            className="btn btn-primary"
            onClick={() => {
              history.push("/view-minting-templates")
            }}
          >
            View Templates
          </button>
        </div>

        <CRow>
          <CCol md={12}>
            <Formik
              initialValues={{ ...data }}
              enableReinitialize
              validationSchema={SignupSchema}
              onSubmit={onSubmit}
            >
              {({
                errors,
                touched,
                values,
                data,
                setFieldValue,
                templateId: id,
                fields,
              }) => (
                <Form>
                  <CCard className="col-xl-12 col-lg-12 mx-auto mb-0 rounded shadow-md p-0">
                    <CCardBody>
                      <div
                        style={{ maxWidth: "680px", margin: "auto" }}
                        className=""
                      >
                        <div className="">
                          <>
                            <div className="mb-2">
                              <label
                                htmlFor="templateName"
                                className="mb-2 name"
                              >
                                <strong>Template Name</strong>{" "}
                                <span className="input-error">*</span>
                              </label>

                              <Field
                                name="templateName"
                                placeholder="Enter Template Name"
                                className="form-control"
                                autoComplete="off"
                              />
                              {errors.templateName && touched.templateName ? (
                                <div
                                  style={{ fontSize: "12px" }}
                                  className="text-danger"
                                >
                                  {errors.templateName}
                                </div>
                              ) : null}
                            </div>

                            <div>
                              <div>
                                <label className="name mb-2">
                                  <strong>Template image </strong>{" "}
                                </label>
                                <span className="input-error">*</span>
                                <div className="text-center">
                                  <div className="mb-3 dragdrop-container">
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
                                      <div className="template-screen">
                                        <img
                                          className="checkmark"
                                          src={image.src}
                                          alt=""
                                          onClick={() => {
                                            uploadRef.current.click()
                                          }}
                                        />
                                      </div>
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
                                                    style={{ width: "100px" }}
                                                    src={cloud}
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
                                                      Drag and drop image file
                                                      here, or click to select{" "}
                                                      <br />
                                                      <small className="text-center">
                                                        <strong>
                                                          Supported files:
                                                        </strong>{" "}
                                                        jpeg, jpg, png. | Will
                                                        be resized to: 1920x1080
                                                        px.
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
                              </div>
                            </div>
                          </>
                        </div>
                      </div>
                      <div className="mb-0 text-center buttonAdd">
                        <button className="btn btn-primary" type="submit">
                          Add
                        </button>
                      </div>
                    </CCardBody>
                  </CCard>
                </Form>
              )}
            </Formik>
          </CCol>
        </CRow>
      </div>
    </>
  )
}
