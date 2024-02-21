import React, { useState, useRef, useEffect } from "react"
import { CCard, CCardBody, CCol, CRow, CFormCheck } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import Dropzone from "react-dropzone"
import upload1 from "../../../assets/upload3.webp"
import "./editTemplate.scss"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { changeApiStatus } from "admin/Common/utility"
import {
  API_BASE_URL,
  GET_MINT_TEMPLATE_DETAIL,
  UPDATE_MINTING_TEMPLATE,
} from "admin/Api/api"
import axios from "axios"
import { useProvider } from "admin/context/ProviderApp"
import { useHistory } from "react-router-dom"
import { Loader } from "admin/Loader/Loader"

export const EditMintTemplate = props => {
  const history = useHistory()
  const { addMintTemplate, setAddMintTemplate } = useProvider()
  const SignupSchema = Yup.object().shape({
    templateName: Yup.string().required("Please Enter Custom Template Name"),
  })
  const [loader, setLoader] = useState(true)
  const [template, setTemplate] = useState(null)
  const [mintingTempId, setMintingTempId] = useState("")

  useEffect(() => {
    let mintTempId = localStorage.getItem("mintingTempId")
    if (mintTempId) {
      setMintingTempId(mintTempId)
      getTemplateDetails(mintTempId)
    }
  }, [mintingTempId])

  const [data, setData] = useState({
    templateName: "",
  })

  const uploadRef = useRef(null)
  const [image, setImage] = useState({
    blob: null,
    src: "",
  })

  const handleImageChange = files => {
    const [file] = files
    if (file && file.type.includes("image")) {
      setImage({ blob: file, src: window.URL.createObjectURL(file) })
    } else {
      toast.error("Please select a valid image file")
    }
  }

  const getTemplateDetails = async _mintTempId => {
    try {
      setLoader(true)
      // console.log(_mintTempId, "_mintTempId")
      let user = JSON.parse(localStorage.getItem("authUser"))
      const response = await axios.get(
        `${GET_MINT_TEMPLATE_DETAIL}?id=${_mintTempId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      // console.log(response, "response get mint temp details")

      if (response.status === 200) {
        setData(data => ({
          ...data,
          uniqueId: response.data.data.uniqueId,
          templateName: response.data.data.templateName,
          src: `${API_BASE_URL}/uploads/common/${response.data.data.templateImage}`,
        }))
        setImage({
          ...image,
          src: `${API_BASE_URL}/uploads/common/${response.data.data.templateImage}`,
        })
        setTemplate(response.data.data)
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }

  const updateMintingTemplate = async values => {
    try {
      // console.log(values, "values update mint temp");
      setLoader(true)
      let formdata = new FormData()
      formdata.append("templateName", values.templateName)
      formdata.append("clientId", mintingTempId)

      if (image.blob) {
        formdata.append("templateImage", image.blob)
      }
      let user = JSON.parse(localStorage.getItem("authUser"))
      const response = await axios.post(
        `${UPDATE_MINTING_TEMPLATE}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      // console.log(response, "response update mint temp")
      if (response.status === 200) {
        setAddMintTemplate(true)
        toast.success(response.data.message)
        history.push("/view-minting-templates")
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }
  // console.log(template, "template details-- edit side template")
  // console.log(image, "image--template")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
<div className="page-content">


    <div className="div1 text-end mb-0  d-flex justify-content-between align-items-center">
          {/* <div className="bg-white pb-3 text-center"> */}
            <h5 style={{ fontSize: "18px" }} className="mb-0">Update Minting Template</h5>
          {/* </div> */}
          <div className="text-end mb-2">
          <button onClick={()=>{
            history.push("/view-minting-templates")
          }} className="btn btn-primary">View Templates</button>
        </div>
        </div>
      <CRow>
        
        <CCol md={12}>
          <Formik
            initialValues={{ ...data }}
            enableReinitialize
            validationSchema={SignupSchema}
            onSubmit={updateMintingTemplate}
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
                <CCard className="col-xl-12 col-lg-12 mx-auto mb-0 rounded shadow-md p-2">
                  <CCardBody>
                    <div
                      style={{ maxWidth: "680px", margin: "auto" }}
                      className=""
                    >
                      <div className="">
                        {/* <div className="bg-white pb-3 text-center">
                          <h5
                            style={{ marginTop: "15px", fontSize: "18px" }}
                            className="mb-0"
                          >
                            Update Templates
                          </h5>
                        </div> */}

                        <>
                          <div className="mb-2">
                            <label htmlFor="templateName" className="mb-2 name">
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
                              <div className="input-error">
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
                                <div className="mb-3 editTemplate">
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
                                    <div className="edit-drag-n-drop-container">
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
                                                className="edit-drop-area"
                                                {...getRootProps()}
                                              >
                                                <img
                                                  style={{ width: "200px" }}
                                                  src={upload1}
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
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                    <div className="mb-0 mt-4 text-center buttonAdd">
                      <button className="btn btn-primary" type="submit">
                        Update
                      </button>
                    </div>
                  </CCardBody>
                </CCard>

                {/* <div className="mb-4 text-center buttonAdd">
                  <button  className="btn btn-primary" type="submit">
                    Update
                  </button>
                </div> */}
              </Form>
            )}
          </Formik>
        </CCol>
      </CRow>
</div>

    </>
  )
}
