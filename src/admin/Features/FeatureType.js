import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { ADD_FEATURE_TYPE } from "admin/Api/api"
import { CSwitchCustom } from "../Common/CSwitchCustom"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import * as Yup from "yup"
import style from "./FeatureForm//featureForm.module.css"
import { Card, CardBody, Col, Row } from "reactstrap"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import deleteImg from "../../assets/delete.png"
import { Loader } from "admin/Loader/Loader"
import DataTable from "react-data-table-component"
import ClipLoader from "react-spinners/ClipLoader"
import "flatpickr/dist/themes/material_blue.css"

import axios from "axios"
import { Field, Formik, Form } from "formik"

import { GET_FEATURE_TYPE_LIST, DELETE_FEATURE_TYPE, UPDATE_FEATURE_TYPE } from "admin/Api/api"

import { toast } from "react-toastify"

import { ActiveInactiveFeatureType } from "admin/Api/api"
export const FeatureType = props => {
  //meta title
  // document.title = "Feature Types"

  //   const { loader, setLoader } = useProvider()
  const BASE_URL = process.env.REACT_APP_BASE_URL
  const [featureTypeList, setFeatureTypeList] = useState([])
  const [page, setPage] = useState({ current: 1, totalItems: 0, pageSize: 10 })
  const [isVisible, setIsVisible] = useState(false)
  const [loader, setLoader] = useState(true)
  const [showFeatureDelete, setShowFeatureDelete] = useState(false)
  const [featureTypeData, setFeatureTypeData] = useState({
    id: "",
    name: ""
  })
  const [editFeatureType, setEditFeatureType] = useState(false)

  
  const AddFeaturesTypeSchema = Yup.object().shape({
    featureTypeName: Yup.string().required("Please Enter Feature Type  Name"),
  })


  const handleClose = () => {
    setIsVisible(false)
    setEditFeatureType(false)
  }

  useEffect(() => {
    getFeatureTypes(page.current, page.pageSize)
  }, [page.current, page.pageSize])

  const getFeatureTypes = async (pageNumber, pageSize) => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    await axios
      .get(
        `${GET_FEATURE_TYPE_LIST}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response get Feature Types apiside")

        if (res.status === 200) {
          // setUsers(res.data.data.users)
          setPage({ ...page, totalItems: res.data.data.totalItems })
          setFeatureTypeList(
            res.data.data.items.map((features, index) => {
              return { ...features, serial: index + 1 }
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
        setLoader(false)
      })
  }
  //ends
  //Active InActive FeatureType Api 
  const activeInactiveFeatureType = async (_data, _setShow,_setActive) => {
    // setLoader(true)
    console.log(_data, "_datap")
    let _status

    if (_data.status === "false") {
      _status = "true"
    } else {
      _status = "false"
    }
    console.log(_status, "_status----activate featureTYpe or not ")

    let user = JSON.parse(localStorage.getItem("authUser"))
    await axios
      .delete(`${ActiveInactiveFeatureType}?id=${_data.id}&isDeleted=${_status}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        console.log(res, "response Active feature side ")
        getFeatureTypes(page.current, page.pageSize)
        _setShow(false)
        toast.success(res.data.message)
      })
      .catch(err => {
        // console.log(err, "err Active user side ")
        _setActive(prev=>!prev)
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        // _handleClose()
        // setLoader(false)


      })


  };
  //ends here 
  const addFeatureType = async values => {
    try {
      setLoader(true)
      // console.log(values, "values-ad")
      let user = JSON.parse(localStorage.getItem("authUser"))
      let response = await axios.post(
        `${ADD_FEATURE_TYPE}`,
        { name: values.featureTypeName },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        // console.log(response, "response add Feature Type side ")
        getFeatureTypes(page.current, page.pageSize)
        toast.success(response.data?.message)
        handleClose()
      }
    } catch (err) {
      // console.log(err, "error add Feature Type ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }
  //ends
  const updateFeatureType = async (values) => {
    try {
      setLoader(true)
      // console.log(values, "values-update Feature Type")
      let user = JSON.parse(localStorage.getItem("authUser"))
      let response = await axios.post(
        `${UPDATE_FEATURE_TYPE}`,
        { name: values.featureTypeName, id: featureTypeData.id },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        // console.log(response, "response update Feature Type side ")
        getFeatureTypes(page.current, page.pageSize)
        toast.success(response.data?.message)
        handleClose()
      }
    } catch (err) {
      // console.log(err, "error update Feature Type ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
      setEditFeatureType(false)
    }
  }

  //Delete Feature Type  Api
  const deleteFeatureType = async () => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    await axios
      .delete(
        `${DELETE_FEATURE_TYPE}?id=${featureTypeData.id}`,

        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response delete feature type side")

        if (res.status === 200) {
          toast.success(res.data.message)
          getFeatureTypes(page.current, page.pageSize)
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error delete feature type side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setShowFeatureDelete(false)
        setLoader(false)
      })
  }
  //ends here



  const columns = [
    {
      name: "Sr. No",
      selector: row => {
        return row.serial + (page.current - 1) * page.pageSize
      },
    },
    {
      name: "Name",
      selector: row => {
        return row.name
      },
    },
    {
      name: "Status",
      selector: row => (
        <>
          <CSwitchCustom
            isActive={!row.isDeleted}
            id={row._id}
            onChange={activeInactiveFeatureType}

          />
        </>
      ),
    },
    {
      name: "Action",
      selector: row => (
        <>
          <ul className="list-unstyled hstack gap-1 mb-0">
            {/* <li>
                        <Link to={`#`} >
                            <i className="fas fa-eye"></i>
                        </Link>
                    </li> */}
            <li>
              <Link to={`#`} onClick={() => {
                setFeatureTypeData({
                  name: row.name,
                  id: row._id
                })
                setEditFeatureType(true)

              }}>
                <i className="bx bxs-pencil"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                onClick={() => {
                  setShowFeatureDelete(true)
                  setFeatureTypeData({
                    name: row.name,
                    id: row._id
                  })
                }}
              >
                <img className="delImg" src={deleteImg} alt="" />
              </Link>
            </li>
          </ul>
        </>
      ),
    },
  ]

  // console.log(featureTypeList, "featureTypeList state users side ")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <React.Fragment>
      <ConfirmModal
        text={"Delete Feature Type"}
        onSubmit={deleteFeatureType}
        show={showFeatureDelete}
        setShow={setShowFeatureDelete}
      />

      <Modal
        centered
        // size="lg"
        className="add_Features"
        show={isVisible || editFeatureType}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editFeatureType ? "Update Feature Type" : "Add Feature Type"}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ featureTypeName: editFeatureType ? featureTypeData.name : "" }}
          enableReinitialize
          validationSchema={AddFeaturesTypeSchema}
          onSubmit={editFeatureType ? updateFeatureType : addFeatureType}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Modal.Body className={style.startProjectBody}>

                <div className="mb-3 pt-3 px-3">
                  <label>
                    <strong> Feature Type Name</strong>

                  </label>
                  <Field
                    //   disabled={formik.isSubmitting}
                    name="featureTypeName"
                    id={featureTypeData.id}
                    autoFocus
                    // value = {editFeatureType?featureTypeData.name:""}
                    placeholder="Feature Type Name"
                    className="form-control"
                  />
                  {errors.featureTypeName && touched.featureTypeName ? (
                    <div className="text-danger">{errors.featureTypeName}</div>
                  ) : null}
                </div>
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
                  {editFeatureType ? "Update Feature Type" : "Create Feature Type"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <div className="page-content">
        <div className="container-fluid">
          <div className="div1 mb-2 d-flex justify-content-between align-items-center">

            <h5 style={{ fontSize: "18px" }} > Feature Types </h5>
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsVisible(true)

              }}
            >
              Add Feature Type
            </button>
          </div>
          <Row>
            <Card className="mt-2">
              <CardBody className="border-bottom py-2 ">
                <div className="">
                  <p className="mb-0 card-title flex-grow-1"> Feature Type </p>
                </div>
              </CardBody>
              <CardBody>
                <DataTable
                  striped
                  columns={columns}
                  data={featureTypeList}
                  paginationDefaultPage={page.current}
                  paginationPerPage={page.pageSize}
                  pagination={true}
                  // progressPending={apiStatus.inProgress}
                  paginationServer
                  paginationTotalRows={page.totalItems}
                  onChangePage={e => setPage({ ...page, current: e })}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  onChangeRowsPerPage={e => setPage({ ...page, pageSize: e })}
                  progressComponent={<ClipLoader />}
                />
              </CardBody>
            </Card>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

FeatureType.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

