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
import { GET_PACKAGES, ADD_PACKAGE } from "admin/Api/api"
// import SpinnerComponent from 'src/components/spinner'
// import usePackageForm from 'src/hooks/forms/usePackageForm'
// import { packageSubscriptionPeriod } from 'src/constants/packages'
import style from "./packageForm.module.css"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import axios from "axios"

export const PackageForm = ({
  editId,
  isVisible,
  setVisible,
  handleCloseModal,
  handleSuccess,
  packageId,
  getPackages,
  page,
  loader,
  setLoader,
}) => {
  const [checked, setChecked] = useState(false)
 
  const [manageCms, setManageCms] = useState(false)

  const [customDomain, setCustomDomain] = useState(false)


  // const [loader,setLoader] = useState(false)
 
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
  }

  const addPackage = async (values) => {
    try {
      console.log(manageCms,customDomain,"valuesss---")
      setLoader(true)
      console.log(values, "values-addpackage side ")
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")

      let formdata = {
        // interval: values.packageInterval,
        price: values.packagePrice,
        name: values.packageName,
        type: values.packageType,
        manageCms:manageCms.toString(),
        customDomain:customDomain.toString()

      }
      let response = await axios.post(`${ADD_PACKAGE}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      if (response.status === 200) {
        // console.log(response, "response add package side ")
        toast.success(response.data?.message)
        getPackages(page.current, page.pageSize)
      }
    } catch (err) {
      // console.log(err, "error add Package side  ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setVisible(false)
      setLoader(false)
    }
  };

  // console.log(manageCms,"manageCms--")
  // console.log(customDomain,"customDomain--")

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
            packageName: "",
            packagePrice: "",
            packageInterval: "",
            packageType: "MONTH",
            // manageCms: manageCms,
            // customDomain: customDomain
          }}
          enableReinitialize
          validationSchema={AddNewPackageSchema}
          onSubmit={addPackage}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Add Package</Modal.Title>
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
                                    // value={"MONTH"}
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
                                {/* --- */}


                              </>
                            )}
                          </CRow>
                          {/* -- */}
                        </div>
                      </CCardBody>
                      <div className={`${style.switchPackage} d-flex`}>
                        <CFormSwitch
                          shape="pill"
                          onChange={(e) => {
                            console.log(e.target.checked,"onchange")
                            setManageCms(e.target.checked)
                          }} 
                          // checked={manageOption.manageCms}
                          label={<div>{"Manage Cms"}</div>}
                        />
                        <CFormSwitch
                          shape="pill"
                          // }}
                          onChange={(e) => {
                            console.log(e.target.checked,"onchange")
                            setCustomDomain(e.target.checked)
                          }} 
                          // checked={manageOption.customDomain}
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
                              onChange={e => {
                                packageForm.setFieldValue(fields.FEATURES, {
                                  ...packageForm.values.features,
                                  softDeleteForInvestor: e.target.checked,
                                })
                              }}
                              checked={
                                packageForm.values.features
                                  .softDeleteForInvestor
                              }
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
                  {packageId ? "Update" : "Create"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  )
}
