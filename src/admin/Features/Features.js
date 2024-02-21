import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useProvider } from "admin/context/ProviderApp"
import { GET_FEATURE_LIST, ADD_FEATURE, DELETE_FEATURE, UPDATE_FEATURE } from "admin/Api/api"
import { CSwitchCustom } from "../Common/CSwitchCustom"
import { FeatureForm } from "./FeatureForm/FeatureForm"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import {
  Card,
  CardBody,
  Row,

} from "reactstrap"

import { ActiveInactiveFeature } from "admin/Api/api"
import deleteImg from "../../assets/delete.png"
import { Loader } from "admin/Loader/Loader"
import DataTable from "react-data-table-component"
import ClipLoader from "react-spinners/ClipLoader"
import "flatpickr/dist/themes/material_blue.css"

import axios from "axios"

import { toast } from "react-toastify"
import { GET_FEATURE_TYPE_LIST } from "admin/Api/api"

export const Features = props => {
  //meta title
  const [featureList, setFeatureList] = useState([])
  const [page, setPage] = useState({ current: 1, totalItems: 0, pageSize: 10 })
  const [loader, setLoader] = useState(true)

  const [isVisible, setIsVisible] = useState(false)
  const [showFeatureDelete, setShowFeatureDelete] = useState(false)
  const [featureData, setFeatureData] = useState({
    id: "",
    typeId: "",
    typeName: "",
    name: ""

  })
  const [editFeature, setEditFeature] = useState(false)

  useEffect(() => {
    getFeatureList(page.current, page.pageSize)
  }, [page.current, page.pageSize])

  const addFeature = async (values) => {
    setLoader(true)
    // console.log(values, "values add feature")

    let formdata = {
      typeId: values.featureType,
      name: values.featureName,
    }
    let user = JSON.parse(localStorage.getItem("authUser"))

    await axios
      .post(`${ADD_FEATURE}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        // console.log(res, "response add Feature  api Features side ")
        if (res.status === 200) {
          toast.success(res.data.message)
          getFeatureList(page.current, page.pageSize)
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error add Feature side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setIsVisible(false)
        setLoader(false)
      })
  }
  //ends  

  //Active InActive Templates Api 
  const activeInactiveFeature = async (_data, _setShow,_setActive) => {
    // setLoader(true)
    // console.log(_data, "_datap")
    let _status

    if (_data.status === "false") {
      _status = "true"
    } else {
      _status = "false"
    }
    // console.log(_status, "_status----activate feature or not ")

    let user = JSON.parse(localStorage.getItem("authUser"))
    await axios
      .delete(`${ActiveInactiveFeature}?id=${_data.id}&isDeleted=${_status}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        // console.log(res, "response Active feature side ")
        getFeatureList(page.current, page.pageSize)
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

  const updateFeature = async (values, formik) => {
    setLoader(true)
    // console.log(values, "values update feature")

    let formdata = {
      typeId: values.featureType,
      name: values.featureName,
      id: values.featureId,
    }
    let user = JSON.parse(localStorage.getItem("authUser"))

    await axios
      .post(`${UPDATE_FEATURE}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        // console.log(res, "response update Feature  api Features side ")

        if (res.status === 200) {
          toast.success(res.data.message)
          getFeatureList(page.current, page.pageSize)
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error update Feature side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setIsVisible(false)
        setEditFeature(false)
        setLoader(false)
      })
  }

  const getFeatureList = async (pageNumber, pageSize) => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    await axios
      .get(
        `${GET_FEATURE_LIST}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response get feature list  side")
        // console.log(res.data, "response data users api user side")
        if (res.status === 200) {
          setPage({ ...page, totalItems: res.data.data.totalItems })
          setFeatureList(
            res.data.data.items.map((feature, index) => {
              return { ...feature, serial: index + 1 }
            })
          )
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error get Feature List side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setLoader(false)
      })
  }

  const deleteFeature = async () => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))
    // console.log(featureData, "featureData- delete api side")
    // { id: featureData.id },
    await axios
      .delete(
        `${DELETE_FEATURE}?id=${featureData.id}`,

        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response delete Feature api side")

        if (res.status === 200) {
          toast.success(res.data.message)
          getFeatureList(page.current, page.pageSize)
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error delete Feature api side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setShowFeatureDelete(false)
        setLoader(false)
      })
  }



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
      name: "Feature Type",
      selector: row => {
        return row.type.name
      },
    },

    {
      name: "Status",
      selector: row => (
        <>
          <CSwitchCustom
            isActive={!row.isDeleted}
            id={row._id}
            onChange={activeInactiveFeature}
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
              <Link
                to={`#`}
                onClick={() => {
                  setFeatureData({
                    name: row.name,
                    id: row._id,
                    typeId: row.type._id,
                    typeName: row.type.name
                  })
                  setEditFeature(true)
                }}
              >
                <i className="bx bxs-pencil"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                onClick={() => {
                  setFeatureData({
                    name: row.name,
                    id: row._id,
                    typeId: row.type._id,
                    typeName: row.type.name


                  })
                  setShowFeatureDelete(true)
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
  // console.log(featureList, "featureList state users side ")
  // console.log(featureTypeList, "featureTypeList- feature side ")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <React.Fragment>
      <ConfirmModal
        text={"Delete Feature"}
        onSubmit={deleteFeature}
        show={showFeatureDelete}
        setShow={setShowFeatureDelete}
      />

      <FeatureForm
        addFeature={addFeature}
        featureData={featureData}
        editFeature={editFeature}
        setEditFeature={setEditFeature}
        updateFeature={updateFeature}
        setVisible={setIsVisible}
        isVisible={isVisible}
      />
      <div className="page-content">
        <div className="container-fluid">
          <div className="div1 mb-2 d-flex justify-content-between align-items-center">

            <h5 style={{ fontSize: "18px" }} >Features</h5>

            <button
              className="btn btn-primary"
              onClick={() => {
                setIsVisible(true)

              }}
            >
              Add New Feature
            </button>
          </div>
          <Row>
            <Card className="mt-2">
              <CardBody className="border-bottom py-2 ">
                <div className="">
                  <p className="mb-0 card-title flex-grow-1">
                    {" "}
                    Feature List{" "}
                  </p>

                </div>
              </CardBody>
              <CardBody>
                <DataTable
                  striped
                  columns={columns}
                  data={featureList}
                  paginationDefaultPage={page.current}
                  paginationPerPage={page.pageSize}
                  pagination={true}
                  progressPending={loader}
                  paginationServer
                  paginationTotalRows={page.totalItems}
                  onChangePage={e => setPage({ ...page, current: e })}
                  paginationRowsPerPageOptions={[10, 20]}
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

Features.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

