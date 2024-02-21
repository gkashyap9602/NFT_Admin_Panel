import React, { useState, useRef, useEffect } from "react"
import { CCard, CCardBody, CCol, CRow, CFormCheck } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import { Row, Col } from "reactstrap"
import Dropzone from "react-dropzone"
import cloud from "../../assets/cloud.svg"
import upload1 from "../../assets/upload3.webp"
// import "./addTemplate.scss"
import * as Yup from "yup"
// import {Toastco}
import { showToast } from "admin/Common/utility"
import { toast } from "react-toastify"
// import "./addTemplate.scss"
// import { changeApiStatus } from "admin/utility"
// import tempImg from "../../assets/temp.png"
import { ADD_MINTING_TEMPLATE ,ADD_PAYMENT_METHOD} from "admin/Api/api"
import axios from "axios"
import { useProvider } from "admin/context/ProviderApp"
import { useHistory } from "react-router-dom"
import { Loader } from "admin/Loader/Loader"

export const AddMethod = () => {

  // document.title = "Payment Method"
  const history = useHistory()

  const addPaymentMethodSchema = Yup.object().shape({
    paymentMethodName: Yup.string().required("Please Enter Payment Method Name"),
  })

  const [data, setData] = useState({
    paymentMethodName: "",
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
  const addPaymentMethod = async (values) => {
    try {
      setLoader(true)
    
      // console.log(values, "values add payment method Side ")
    
      let formdata = new FormData()

      formdata.append("name", values.paymentMethodName)

      if (!image.src) {
        toast.error("Please select any image")
        return
      }
      formdata.append("image", image.blob)

      let user = JSON.parse(localStorage.getItem("authUser"))
      const response = await axios.post(`${ADD_PAYMENT_METHOD}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      // console.log(response, "response add Payment Method side")

      if (response.status === 200) {
        toast.success(response.data.message)
        history.push("view-payment-method")
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      // console.log(err, "error add  Payment Method side ")
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
        <div className="div1 text-end mb-0 d-flex justify-content-between align-items-center">
          {/* <div className="bg-white pb-3 text-center"> */}
            <h5 style={{ fontSize: "18px" }} className="mb-0">Add Payment Method</h5>
            
          {/* </div> */}
          <button
            className="btn btn-primary"
              onClick={() => {
                history.push("/view-payment-method")

                // navigator(paths.getViewPayment())
              }}
          >
            View Payment Methods
          </button>
        </div>
        <CRow>
          <CCol md={12} className={"mt-2"}>
            <Formik
              initialValues={{ ...data }}
              enableReinitialize
            validationSchema={addPaymentMethodSchema}

              onSubmit={addPaymentMethod}
            >
              {({
                errors,
                touched,
                values,
                data,
                setFieldValue,
                paymentId: id,
                fields,
              }) => (
                <Form>
                  <CCard className="col-xl-12 col-lg-12 mx-auto mb-4 rounded shadow-md p-2">
                    <CCardBody>
                      <div className="row ">
                        <div className="col-md-12 mt-2 justify-content-center align-item-center">
                          {/* <div className="bg-white pb-3 text-center">
                          <h5 className="mb-0">Add Payment Method</h5>
                        </div> */}

                          <>
                            <Row className="justify-content-center">
                              <Col sm={8} className="pb-3">
                                <div>
                                  <label
                                    htmlFor="networkName"
                                    className="mb-2 name"
                                  >
                                    <strong>Payment Method Name</strong>{" "}
                                    <span className="input-error">*</span>
                                  </label>

                                  <Field
                                    name="paymentMethodName"
                                    placeholder="Enter Payment Method Name"
                                    className="form-control"
                                    autoComplete="off"
                                  />
                                  {errors.paymentMethodName && touched.paymentMethodName ? (
                                    <div className="text-danger">
                                      {errors.paymentMethodName}
                                    </div>
                                  ) : null}
                                </div>
                              </Col>

                              <Col sm={8} className="pb-3">
                                <div>
                                  <div>
                                    <label className="name mb-2">
                                      <strong>Payment Method image </strong>{" "}
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
                                          <img
                                            className="banner-img"
                                            src={image.src}
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
                                                  handleImageChange(
                                                    acceptedFiles
                                                  )
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
                                                          Drop your image file
                                                          here
                                                        </div>
                                                      ) : (
                                                        <p>
                                                          Drag and drop image
                                                          file here, or click to
                                                          select <br />
                                                          <small className="text-center">
                                                            <strong>
                                                              Supported files:
                                                            </strong>{" "}
                                                            jpeg, jpg, png. |
                                                            Will be resized to:
                                                            1920x1080 px.
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
                              </Col>
                            </Row>
                          </>
                        </div>
                      </div>
                      <div className="mb-4 text-center buttonAdd">
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
