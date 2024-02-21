import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useProvider } from "admin/context/ProviderApp"
import moment from "moment"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import searchicon from "../../../assets/searchImg.svg"
import { CCard, CCardBody, CCol, CFormSelect, CRow } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { IoArrowBackSharp } from "react-icons/io5"
import { useParams } from "react-router-dom"

import { Button, Card, CardBody, Col, Row } from "reactstrap"
// import { CSwitch } from "./CSwitch"
import { BsArrowUpRightCircleFill } from "react-icons/bs"

import deleteImg from "../../../assets/delete.png"
import { Loader } from "admin/Loader/Loader"
import DataTable from "react-data-table-component"
import "../Users/users.css"
import ClipLoader from "react-spinners/ClipLoader"
import "flatpickr/dist/themes/material_blue.css"
import {
  fullDateFormat,
  StandardPicketDateFormat,
  downloadFile,
} from "admin/Common/utility"
import { withTranslation } from "react-i18next"
import axios from "axios"
import downloadfileicon from "../../../assets/downloadFileIcon.svg"
import DateRangePicker from "react-bootstrap-daterangepicker"
// import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-daterangepicker/daterangepicker.css"
import schedule from "../../../assets/calander.svg"
import calendarremovelines from "../../../assets/calander-remove.svg"
import { CollectionDetails } from "./CollectionDetails"
import {
  GET_COLLECTION_DETAILS_OF_USER,
  GET_USER_COLLECTIONS,
} from "admin/Api/api"
import {
  CInputGroupText,
  CFormInput,
  CInputGroup,
  CFormLabel,
} from "@coreui/react"
import { toast } from "react-toastify"

import { capitalize } from "admin/Common/utility"
export const Collections = (props) => {
  //meta title
    // document.title = "User Collections"
  // const { setViewInfo, viewInfo } = props
  const { id } = useParams()
let userr = localStorage.getItem("view-User")

let newuser = userr.substring(0,userr.indexOf("@"))
if(newuser.substring(0,newuser.indexOf("."))){
  newuser = newuser.substring(0,newuser.indexOf("."))
}
  const [viewUser,setViewUser] = useState(newuser)
  const [viewInfo, setViewInfo] = useState({
    status: false,
    id: "",
  })

  const { loader, setLoader } = useProvider()
  const BASE_URL = process.env.REACT_APP_BASE_URL
  const [dateFilter, setDateFilter] = useState([])
  const [collections, setCollections] = useState([])
  const [collectionDetails, setCollectionDetails] = useState("")
  const [page, setPage] = useState({ current: 1, totalItems: 0, pageSize: 10 })
  const [calendarIsShowing, setCalendarIsShowing] = useState(false)
  const [showUserDelete, setShowUserDelete] = useState(false)
  const [userId, setUserId] = useState("")
  const [loader2, setLoader2] = useState(false)
  const inputRef = useRef(null)
  const [user, setUser] = useState({
    userName: "",
    email: "",
  })

  const updateProfile = () => {}
  const ProfileSchema = Yup.object().shape({
    userName: Yup.string()
      .min(4, "Too Short!")
      .max(20, "Too Long!")
      .required("Please enter your  name"),

  })
  const debounceTime = 300


  let distinctUntilChanged = null

  const [query, setQuery] = useState("")

  const onQueryChange = e => {
    const value = e.target.value.trim()
    // console.log(value, "onQueryChange side--")
    setQuery(value)
    if (distinctUntilChanged) {
      clearTimeout(distinctUntilChanged)
      distinctUntilChanged = null
    }
    distinctUntilChanged = setTimeout(() => {
      setQuery(value)
      getCollectionsOfUser(page.current, page.pageSize, dateFilter, value)
      distinctUntilChanged = null
    }, debounceTime)
  }

  useEffect(() => {
    getCollectionsOfUser(page.current, page.pageSize)
  }, [page.current, page.pageSize])

  //get Users Api
  const getCollectionsOfUser = async (
    pageNumber,
    pageSize,
    dateFilter = [],
    query = "",
    exportRequest = "false"
  ) => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    const [startDate, endDate] = dateFilter.length === 0 ? ["", ""] : dateFilter

    // console.log(exportRequest, "exportRequest get user api side ")
    await axios
      .get(
        `${GET_USER_COLLECTIONS}?pageNumber=${pageNumber}&pageSize=${pageSize}&userId=${id}&startDate=${startDate}&endDate=${endDate}&exportRequest=${exportRequest}&searchByName=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response get collections of user api side")
        // console.log(res.data, "response data users api user side")

        if (exportRequest === "true") {
          const url = URL.createObjectURL(
            new Blob([res.data], { type: "text/csv" })
          )

          const date1 = moment(Date.now()).format("DD-MM-YYYY")
          // const time1 = moment(Date).format("h:mm a")
          // const finalDate = date1 + "-" + time1
          // console.log(finalDate, "final date")
          downloadFile(url, `Collections${date1}.csv`)
          return
        }

        if (res.status === 200) {
          // setUsers(res.data.data.users)
          setPage({ ...page, totalUser: res.data.data.totalItems })
          setCollections(
            res.data.data.items.map((user, index) => {
              return { ...user, serial: index + 1 }
            })
          )
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error get collections of user api  side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setLoader(false)
      })
  }

  const getCollectionDetails = async _collectionId => {
    setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))

    // console.log(id,"userid api")
    // console.log(collectionDetails,"collectionDetails-api")

    await axios
      .get(
        `${GET_COLLECTION_DETAILS_OF_USER}?userId=${id}&collectionId=${_collectionId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response get collection details api side")
        if (res.status === 200) {
          setCollectionDetails(res.data.data)
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error collection details api  side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setLoader(false)
      })
  }
  //ends here

  //Delete User Api
  const deleteUser = async () => {
    setLoader2(true)
    let user = JSON.parse(localStorage.getItem("authUser"))
    // console.log(user.accessToken, "user- delete side")
    await axios
      .post(
        `${DELETE_USER}`,
        { clientId: userId },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response get users api user side")

        if (res.status === 200) {
          toast.success(res.data.message)
          getCollectionsOfUser(page.current, page.pageSize)
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error get users api user side")
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(() => {
        setShowUserDelete(false)
        setLoader2(false)
      })
  }
  //ends here

  const dateFilterChange = (e, picker) => {
    // console.log(picker, "picker date filter")
    // console.log(picker.startDate.format("YYYY-MM-DD"), "picker date filter")

    const filter = [
      picker.startDate.format("YYYY-MM-DD"),
      picker.endDate.format("YYYY-MM-DD"),
    ]
    setDateFilter(filter)
    getCollectionsOfUser(page.current, page.pageSize, filter, query)
  }

  const columns = [
    {
      name: "Sr. No",
      selector: row => {
        return row.serial + (page.current - 1) * page.pageSize
      },
    },
    // {
    //   name: "User",
    //   selector: row => {
    //     return row.userName || row.firstName
    //   },
    // },
    {
      name: "Collection Name",
      selector: row => {
        return row.name

        // return row.email
      },
    },
    {
      name: "Is Generated",
      selector: row => {
        // console.log(row.isGenerated,"isgennnn")
        return row.isGenerated.toString()

        // return row.email
      },
    },
    {
      name: "Created At",
      selector: row => fullDateFormat(row.createdAt),
    },

    {
      name: "Action",
      selector: row => (
        <>
          <ul className="list-unstyled hstack gap-1 mb-0">
            <li>
              <Link
                to={`#`}
                onClick={() => {
                  setViewInfo({
                    status: true,
                    id: row._id,
                  })
                  getCollectionDetails(row._id)

                }}
              >
                <i className="eyeIcon fas fa-eye"></i>
              </Link>
            </li>
          </ul>
        </>
      ),
    },
  ]

  return loader2 || (loader && !collections.length) ? (
    <>
      <Loader />
    </>
  ) : (
    <React.Fragment>
      <ConfirmModal
        text={"Delete User"}
        onSubmit={deleteUser}
        show={showUserDelete}
        setShow={setShowUserDelete}
      />

      {!viewInfo.status? (
        <>
          <div className="page-content">
            <Row>
              <Col lg="12">
                <Card className="mt-1">
                  <CardBody className="border-bottom py-2">
                    <div className="">
                      <h5 style={{fontSize:"18px",fontWeight:"500"}} className="mb-0 mt-3 card-title flex-grow-1">
                        {`${capitalize(viewUser)}'s Collections`}
                      </h5>

                      <div className="search-box-date me-xxl-2 mt-4 my-xxl-0 d-flex align-items-center justify-content-between">
                        <div
                          className="filterDiv position-relative mt-4 "
                          style={{
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <CFormLabel
                            className="visually-hidden"
                            htmlFor="autoSizingInputGroup"
                          >
                            Filter by Date
                          </CFormLabel>
                          <CInputGroup style={{ width: "100%" }}>
                            <DateRangePicker
                              onApply={dateFilterChange}
                              onShow={() => setCalendarIsShowing(true)}
                              onHide={() => setCalendarIsShowing(false)}
                            >
                              <input
                                ref={inputRef}
                                readOnly
                                id="file-input"
                                placeholder="Filter by Date"
                                className="form-control"
                                style={{ caretColor: "rgba(0,0,0,0)" }}
                                value={
                                  dateFilter.length
                                    ? `${StandardPicketDateFormat(
                                        dateFilter[0]
                                      )} - ${StandardPicketDateFormat(
                                        dateFilter[1]
                                      )}`
                                    : ""
                                }
                                // value={
                                //   dateFilter.length
                                //     ? `${dateFilter[0]} - ${dateFilter[1]}`
                                //     : ''
                                // }
                              />
                            </DateRangePicker>
                            <CInputGroupText>
                              <img
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (!calendarIsShowing && dateFilter.length) {
                                    // console.log("DANGER CLOCKEDDD")
                                    setDateFilter([])
                                    getCollectionsOfUser(
                                      page.current,
                                      page.pageSize,
                                      []
                                    )
                                  }
                                }}
                                src={
                                  calendarIsShowing
                                    ? calendarremovelines
                                    : dateFilter.length
                                    ? calendarremovelines
                                    : schedule
                                }
                                alt=""
                                width={20}
                              />
                            </CInputGroupText>
                          </CInputGroup>

                          {/*  */}
                          <CFormLabel
                            className="visually-hidden"
                            htmlFor="autoSizingInputGroup"
                          >
                            Search
                          </CFormLabel>
                          <CInputGroup>
                            <CFormInput
                              id="autoSizingInputGroup"
                              placeholder="Search Name"
                              type="search"
                              value={query}
                              onChange={onQueryChange}
                            />
                            <CInputGroupText>
                              <img
                                src={searchicon}
                                alt=""
                                width={15}
                                style={{ cursor: "pointer" }}
                              />
                            </CInputGroupText>
                          </CInputGroup>
                        </div>

                        <Button
                          style={{ marginTop: "22px" }}
                          onClick={() =>
                            getCollectionsOfUser(
                              page.current,
                              page.pageSize,
                              dateFilter,
                              query,
                              "true"
                            )
                          }
                          color="success"
                          className="hand text-white px-2"
                        >
                          <img
                            src={downloadfileicon}
                            alt=""
                            width={15}
                            className="me-2"
                          />
                          Export CSV
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody>
                    <DataTable
                      striped
                      columns={columns}
                      data={collections}
                      paginationDefaultPage={page.current}
                      paginationPerPage={page.pageSize}
                      pagination={true}
                      progressPending={loader}
                      paginationServer
                      paginationTotalRows={page.totalUser}
                      onChangePage={e => setPage({ ...page, current: e })}
                      paginationRowsPerPageOptions={[10, 20, 30, 40]}
                      onChangeRowsPerPage={e =>
                        setPage({ ...page, pageSize: e })
                      }
                      progressComponent={<ClipLoader />}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <>
        <CollectionDetails collectionDetails = {collectionDetails} setViewInfo = {setViewInfo} />
      
        </>
      )}
    </React.Fragment>
  )
}
