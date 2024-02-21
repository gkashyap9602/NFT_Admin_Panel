import {
  CButton,
  CCol,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react"
import axios from "axios"
import style from "./featureForm.module.css"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import { Field, FieldArray, FormikProvider, Formik, Form } from "formik"
import React from "react"
import { useEffect } from "react"
//   import useFeatureForm from 'src/hooks/forms/useFeatureForm'
// import useFeatureForm from 'admin/hooks/useFeatureForm'
import PropTypes from "prop-types"
// import { Form } from "reactstrap"
import { useState } from "react"
//   import { getList } from 'src/services/featureTypeService'
import CIcon from "@coreui/icons-react"
import { cilTrash } from "@coreui/icons"
import * as Yup from "yup"
import { GET_FEATURE_TYPE_LIST } from "admin/Api/api"

export const FeatureForm = (props) => {

  const {
    addFeature,
    updateFeature,
    editFeature,
    setEditFeature,
    featureData,
    isVisible,
    setVisible,
  } = props;


  const [types, setTypes] = useState([])

  // console.log(featureData, "featureData feature Form side")
  useEffect(() => {
    getFeatureTypes()
  }, [])
  const getFeatureTypes = async () => {
    // setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    await axios
      .get(`${GET_FEATURE_TYPE_LIST}?pageNumber=${1}&pageSize=${30}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        // console.log(res, "response get Feature Types api Feature Form side ")

        if (res.status === 200) {
          // setUsers(res.data.data.users)
          setTypes(
            res.data.data.items.map((featureTypes, index) => {
              return { ...featureTypes, serial: index + 1 }
            })
          )
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error get Feature Types  side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        // setLoader(false)
      })
  }
  //ends

  const AddNewFeaturesSchema = Yup.object().shape({
    featureName: Yup.string().required("Please Enter Feature Name"),
    featureType: Yup.string().required("Please Select Feature Type"),
  })

  const handleClose = () => {
    setVisible(false)
    setEditFeature(false)
  }
  // console.log(types, "feature types feature form side ")
  return (
    <Modal
      centered
      // size="lg"
      className="add_Features"
      show={editFeature ? editFeature : isVisible}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {editFeature ? "Update Feature" : "Add Feature"}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          featureName: editFeature ? featureData.name : "",
          featureType: editFeature ? featureData.typeId : "",
          featureId: editFeature ? featureData.id : "",
          featureTypeName: editFeature ? featureData.typeName : "",



        }}
        enableReinitialize
        validationSchema={AddNewFeaturesSchema}
        onSubmit={editFeature ? updateFeature : addFeature}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Modal.Body className={style.startProjectBody}>
              {/* <div className="card-sub-title border-bottom">
                <h4 className="mb-0 bg-light p-2 ">Create a New Feature</h4>
              </div> */}
              <div className="mb-3 pt-3 px-3">
                <label>
                  <strong>Feature Name</strong>
                </label>
                <Field
                  //   disabled={formik.isSubmitting}
                  name="featureName"
                  id={featureData.id}
                  autoFocus
                  placeholder="Enter Feature Name"
                  className="form-control"
                />
                {errors.featureName && touched.featureName ? (
                  <div className="text-danger">{errors.featureName}</div>
                ) : null}
              </div>
              <div className="mb-3 px-3">
                <label>
                  <strong>Select Feature Type</strong>
                </label>
                <Field className = "form-select" name="featureType" as="select">
                  <option value={""}>Select Feature Type</option>

                  {types.map(type => (
                    <>
                      <option value={type._id}>{type.name}</option>
                    </>
                  ))}
                </Field>
                {errors.featureType && touched.featureType ? (
                  <div className="text-danger">{errors.featureType}</div>
                ) : null}

                {/* <Field
                  name="featureType"
                  id={featureData.typeId}
                  render={({ field, form, meta }) => (
                    <>
                      <CFormSelect >
                        <option value={""}>Select Feature Type</option>
                        {types.map((type) => (
                          <>
                        <option value={type._id}>{type.name}</option>
                        </>
                        ))}
                      </CFormSelect>
                      {errors.featureType && touched.featureType ? (
                        <div className="text-danger">{errors.featureType}</div>
                      ) : null}
                    </>
                  )}
                /> */}
              </div>

              {/* <div>
                <FieldArray
                  name="featureKeys"
                  render={({ form, remove, push }) => {
                    return (
                      <>
                        <div className="d-flex align-items-center justify-content-between card-sub-title border-bottom bg-light">
                          <h4 className="mb-0 bg-light p-2 ">Feature Keys</h4>
                          <CButton
                            size="sm"
                            color="primary"
                            className="text-white my-2 me-3"
                            onClick={() =>
                              push({
                                ["fields.KEYTYPE_ID"]: '',
                                ["fields.KEY_VALUE_KEY"]: '',
                              })
                            }
                          >
                            Add Key
                          </CButton>
                        </div>
                        <div className="">
                          {!form.values[""].length && (
                            <div className="p-4 text-center bg-light">
                              <h6 className="text-danger">You can add key here!!</h6>
                            </div>
                          )}
                        </div>
                        {!!form.values[fields.KEY_VALUE].length &&
                          form.values[fields.KEY_VALUE].map((keyVal, index) => (
                            <CRow
                              key={index}
                              className="px-2 py-2 mx-0 align-items-center border-bottom border-light"
                            >
                              <CCol xs="1" className="border-end">
                                <h6>#{index + 1}</h6>
                              </CCol>
                              <CCol xs="4" className="border-end">
                                <div className="">
                                  <Field
                                    disabled={formik.isSubmitting}
                                    name={`${fields.KEY_VALUE}.${index}.${fields.KEY_VALUE_KEY}`}
                                    render={({ field, form, meta }) => (
                                      <>
                                        <CFormInput {...field} placeholder="Key Name" />
                                        {meta.touched && meta.error ? (
                                          <div className="text-danger">{meta.error}</div>
                                        ) : null}
                                      </>
                                    )}
                                  />
                                </div>
                              </CCol>
                              <CCol xs="2" className="border-end">
                                <div>
                                  <Field
                                    disabled={formik.isSubmitting}
                                    name={`${fields.KEY_VALUE}.${index}.${fields.IS_REQUIRED}`}
                                    id={`${fields.KEY_VALUE}.${index}.${fields.IS_REQUIRED}`}
                                    type="checkbox"
                                  />{' '}
                                  <label>Required</label>
                                </div>
                              </CCol>
                              <CCol xs="4" className="border-end">
                                <div>
                                  <Field
                                    disabled={formik.isSubmitting}
                                    name={`${fields.KEY_VALUE}.${index}.${fields.KEYTYPE_ID}`}
                                    id={`${fields.KEY_VALUE}.${index}.${fields.KEYTYPE_ID}`}
                                    render={({ field, form, meta }) => (
                                      <>
                                        <CFormSelect {...field}>
                                          <option value={''}> Type</option>
                                          <option>Text</option>
                                          <option>Number</option>
                                          <option>Varchar</option>
                                        </CFormSelect>
                                        {meta.error && meta.touched ? (
                                          <div className="text-danger">{meta.error}</div>
                                        ) : null}
                                      </>
                                    )}
                                  />
                                </div>
                              </CCol>
                              <CCol xs="1" className="text-center">
                                <CIcon
                                  icon={cilTrash}
                                  className="text-danger hand"
                                  onClick={() => remove(index)}
                                />
                              </CCol>
                            </CRow>
                          ))}
                      </>
                    )
                  }}
                />
              </div> */}
            </Modal.Body>

            <Modal.Footer className={style.startProjectFooter}>
              <Button
                variant="light"
                onClick={handleClose}
                className={style.Btn}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={style.createFeatureBtn}
                // disabled={editItem ? false : formik.isSubmitting || !formik.dirty || !formik.isValid}
              >
                {editFeature ? "Update Feature" : "Create Feature "}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

FeatureForm.propTypes = {
  editItem: PropTypes.any,
  onSuccess: PropTypes.func,
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
}
