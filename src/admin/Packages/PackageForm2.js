import React, { useState } from "react"
import PropTypes from "prop-types"
import { toast } from "react-toastify"
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react"
import { Form, Field, FormikProvider, Formik } from "formik"
import * as Yup from "yup"
import { GET_PACKAGES, ADD_PACKAGE ,UPDATE_PACKAGE} from "admin/Api/api"

import style from "./packageForm.module.css"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { Loader } from "admin/Loader/Loader"

export const PackageForm2 = ({
  editId,
  isVisible,
  setVisible,
  handleCloseModal,
  handleSuccess,
  packageId,
  getPackages,
  page,
  loader,
  currentPackageDetails,
  setLoader,
  setCurrentPackageDetails,
  getPackageDetailsWithId
}) => {
  const [checked, setChecked] = useState(false)
  // const [loader,setLoader] = useState(false)
  //   const {
  //     form: packageForm,
  //     getFieldError,
  //     hasFieldError,
  //     fields,
  //   } = usePackageForm({
  //     editId: editId,
  //     checked: checked,
  //     successCallback: () => {
  //       handleSuccess()
  //     },
  //     errorCallback: () => {},
  //   })
  const AddNewPackageSchema = Yup.object().shape({
    packageName: Yup.string().required("Subscription Name Is Required"),
    packagePrice: Yup.number().required("Subscription Price Is Required"),
    // packageInterval: Yup.number().required("Subscription Period Is Required"),
    packageType: Yup.string().required("Package Type is Required"),
  })


  const handleToggle = e => {
    setChecked(e.target.checked)
  }
  const handleClose = () => {
    setVisible(false)
    // setCurrentPackageDetails("")
  }

  const updatePackage = async (values) => {
    console.log(values, "values-update package side ")

    try {
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")

      let formdata = {
        // interval: values.packageInterval,
        price: values.packagePrice,
        name: values.packageName,
        type: values.packageType,
        numberOfCollections:values.numberOfCollections,
        numberOfEditions:values.numberOfEditions,
        manageCms:values.manageCms.toString(),
        customDomain:values.customDomain.toString(),
        id:packageId
      }
      let response = await axios.post(`${UPDATE_PACKAGE}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      if (response.status === 200) {
        console.log("--under update pack")
        getPackages(page.current, page.pageSize)
        getPackageDetailsWithId(packageId)
        // console.log(response, "response add package side ")
        toast.success(response.data?.message)
        // getPackages(page.current, page.pageSize)
      }
    } catch (err) {
      // console.log(err, "error add Package side  ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setVisible(false)
      setLoader(false)
    }
  }
  return (
    <>
      <Modal
        // scrollable
        centered
        // size="lg"
        className="add_Packages"
        show={isVisible}
        onHide={handleClose}
      >
        <Formik
          initialValues={{
            packageName: currentPackageDetails.name,
            packagePrice: currentPackageDetails.price,
            packageInterval: "",
            packageType: currentPackageDetails.type,
            numberOfCollections:currentPackageDetails.numberOfCollections,
            numberOfEditions:currentPackageDetails.numberOfEditions,
            manageCms:currentPackageDetails.manageCms,
            customDomain:currentPackageDetails.customDomain,

          }}
          enableReinitialize
          validationSchema={AddNewPackageSchema}
          onSubmit={updatePackage}
        >
          {({ errors, touched, values,setFieldValue }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Update Package</Modal.Title>
              </Modal.Header>
              <Modal.Body className={style.startProjectBody}>
                <CCol md={12}>
                  <CCardGroup>
                    <CCard className={`border-0 col-12`}>
                      <div className="card-sub-title border-bottom">
                        <h4 className={`${style.plan_Text} mb-0 bg-light p-2 `}>
                          Plan/Pricing
                        </h4>
                      </div>
                      <CCardBody className="p-3">
                        <div className="mb-3">
                          <label htmlFor={"lable"}>
                            <strong>Label: </strong>
                          </label>
                          <Field
                            // disabled={packageForm.isSubmitting}
                            name="packageName"
                            autoFocus
                            id={"fields.LABEL"}
                            placeholder="Package Label"
                            className="form-control"
                          />
                          {errors.packageName && touched.packageName ? (
                            <div className="text-danger">
                              {errors.packageName}
                            </div>
                          ) : null}
                        </div>
                        
                        <div className="mb-3">
                          <CRow>
                            {checked ? (
                              <CCol xs={6}>
                                <label htmlFor={"fields.AMOUNT"}>
                                  <strong>Subscription Price: </strong>
                                </label>
                                <Field
                                  //   disabled={packageForm.isSubmitting}
                                  name="packagePrice"
                                  id={"34"}
                                  placeholder="Price"
                                  className="form-control"
                                />
                                {errors.packagePrice && touched.packagePrice ? (
                                  <div className="text-danger">
                                    {errors.packagePrice}
                                  </div>
                                ) : null}
                              </CCol>
                            ) : (
                              <>
                                <CCol xs={6}>
                                  <label htmlFor={""}>
                                    <strong>Subscription Price: </strong>
                                  </label>
                                  <Field
                                    // disabled={packageForm.isSubmitting}
                                    name="packagePrice"
                                    id={"fields.AMOUNT"}
                                    placeholder="Price"
                                    className="form-control"
                                  />
                                  {errors.packagePrice &&
                                  touched.packagePrice ? (
                                    <div className="text-danger">
                                      {errors.packagePrice}
                                    </div>
                                  ) : null}
                                </CCol>
                                <CCol xs={6}>
                                  <label htmlFor={"fields.AMOUNT"}>
                                    <strong>Subscription Period: </strong>
                                  </label>
                                  <Field
                                    disabled={true}
                                    name="packageType"
                                    id={"id"}
                                    // placeholder="Price"
                                    className="form-control"
                                  />
                                  {/* <CInputGroup
                                    className={`${style.inputGroupSelect} border`}
                                  >
                                    
                                    <CInputGroupText className={`border-0 p-0`}>
                                      <Field
                                        className = "form-select"
                                        as="select"
                                        name="packageType"
                                        id="id"
                                      >
                                 <option value={""}>Select Period</option>
 
                                        <option
                                          value={"MONTH"}
                                        >
                                          {"Monthly"}
                                        </option>
                                      </Field>
                                    </CInputGroupText>
                                  </CInputGroup> */}
                                  {errors.packageType && touched.packageType ? (
                                    <div className="text-danger">
                                      {errors.packageType}
                                    </div>
                                  ) : null}

                                  
                                </CCol>
                                {/* -- */}
                                <CCol xs={6} className = "mt-1">
                                  <label htmlFor={""}>
                                    <strong>Number Of Collections: </strong>
                                  </label>
                                  <Field
                                    // disabled={packageForm.isSubmitting}
                                    name="numberOfCollections"
                                    id={"fields.AMOUNT"}
                                    placeholder="Number Of Collections"
                                    className="form-control"
                                  />
                                  {errors.packagePrice &&
                                  touched.packagePrice ? (
                                    <div className="text-danger">
                                      {errors.packagePrice}
                                    </div>
                                  ) : null}
                                </CCol>
                                <CCol xs={6} className = "mt-1">
                                  <label htmlFor={""}>
                                    <strong>Number Of Editions: </strong>
                                  </label>
                                  <Field
                                    // disabled={packageForm.isSubmitting}
                                    name="numberOfEditions"
                                    id={"fields.AMOUNT"}
                                    placeholder="Number Of Editions"
                                    className="form-control"
                                  />
                                  {errors.packagePrice &&
                                  touched.packagePrice ? (
                                    <div className="text-danger">
                                      {errors.packagePrice}
                                    </div>
                                  ) : null}
                                </CCol>
                              </>
                            )}
                          </CRow>
                        </div>
                      </CCardBody>
                      <div className={`${style.switchPackage} d-flex`}>
                        <CFormSwitch
                          shape="pill"
                          name="manageCms"
                          // }}
                          onChange={(e) => {
                            setFieldValue("manageCms",e.target.checked)
                          }}
                          defaultChecked={values.manageCms}
                          label={<div>{"Manage Cms"}</div>}
                        />
                        <CFormSwitch
                          shape="pill"
                          name="customDomain"
                          onChange={(e) => {
                            setFieldValue("customDomain",e.target.checked)
                          }}
                          defaultChecked={values.customDomain}

                          // checked={true}
                          label={<div>{"Live/Custom Domain"}</div>}
                        />
                      </div>
                    </CCard>
                  </CCardGroup>
                  {/* {packageId ? (
                    <div className="d-flex align-items-center">
                      <CCardGroup>
                        <CCard className="border-0">
                          <CCardBody>
                            <CFormSwitch
                              shape="pill"
                              onChange={(e) => {
                            setFieldValue("customDomain",e.target.checked)
                          }}
                          defaultChecked={values.customDomain}
                              label={<div>{"Soft Delete For Investor"}</div>}
                            />
                          </CCardBody>
                        </CCard>
                      </CCardGroup>
                      <CCardGroup>
                        <CCard className="border-0">
                          <CCardBody>
                            <CFormSwitch
                              shape="pill"
                              // }}
                              onChange={e => {
                                packageForm.setFieldValue(fields.FEATURES, {
                                  ...packageForm.values.features,
                                  kyc: e.target.checked,
                                })
                              }}
                              checked={packageForm.values.features.kyc}
                              label={<div>{"KYC"}</div>}
                            />
                          </CCardBody>
                        </CCard>
                      </CCardGroup>
                    </div>
                  ) : null} */}
                </CCol>
              </Modal.Body>
              <Modal.Footer className={style.startProjectFooter}>
                <Button
                  variant="light"
                  className={style.Btn}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className={style.createFeatureBtn}>
                  {packageId ? "Update" : "Update"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  )
}

// PackageForm.propTypes = {
//   editId: PropTypes.any,
//   packageId: PropTypes.any,
//   handleCloseModal: PropTypes.func,
//   isVisible: PropTypes.bool,
//   handleSuccess: PropTypes.func,
// }
