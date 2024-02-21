import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useProvider } from "admin/context/ProviderApp"
import moment from "moment"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import searchicon from "../../../assets/searchImg.svg"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
// import { CSwitch } from "./CSwitch"
import { CSwitchCustom } from "admin/Common/CSwitchCustom"
import deleteImg from "../../../assets/delete.png"
import { Loader } from "admin/Loader/Loader"
import DataTable from "react-data-table-component"
import "./users.css"
import ClipLoader from "react-spinners/ClipLoader"
import "flatpickr/dist/themes/material_blue.css"
import { ACTIVE_INACTIVE_USER } from "admin/Api/api"


import {
  fullDateFormat,
  StandardPicketDateFormat,
  downloadFile,
} from "admin/Common/utility"
import { withTranslation } from "react-i18next"
import axios from "axios"
import downloadfileicon from "../../../assets/downloadFileIcon.svg"
import DateRangePicker from "react-bootstrap-daterangepicker"
import "bootstrap-daterangepicker/daterangepicker.css"
import schedule from "../../../assets/calander.svg"
import calendarremovelines from "../../../assets/calander-remove.svg"

import { GET_USER_DETAILS_WITH_PAGINATION, DELETE_USER } from "admin/Api/api"
import {
  CInputGroupText,
  CFormInput,
  CInputGroup,
  CFormLabel,
} from "@coreui/react"
import { toast } from "react-toastify"

const Transaction = props => {
  //meta title
  // document.title = "Users"

  const { loader, setLoader } = useProvider()
  const BASE_URL = process.env.REACT_APP_BASE_URL
  const [dateFilter, setDateFilter] = useState([])
  const [users, setUsers] = useState([])
  const [page, setPage] = useState({ current: 1, totalItems: 0, pageSize: 10 })
  const [calendarIsShowing, setCalendarIsShowing] = useState(false)
  const [showUserDelete, setShowUserDelete] = useState(false)
  const [userId, setUserId] = useState("")
  const [loader2, setLoader2] = useState(false)
  const inputRef = useRef(null)
  const debounceTime = 300
  let distinctUntilChanged = null

  const [query, setQuery] = useState("")

  const onQueryChange = e => {
    const value = e.target.value.trim()
    // console.log(value, 'onQueryChange side--')
    setQuery(value)
    if (distinctUntilChanged) {
      clearTimeout(distinctUntilChanged)
      distinctUntilChanged = null
    }
    distinctUntilChanged = setTimeout(() => {
      setQuery(value)
      getUsers(page.current, page.pageSize, dateFilter, value)
      distinctUntilChanged = null
    }, debounceTime)
  }

  useEffect(() => {
    getUsers(page.current, page.pageSize)
  }, [page.current, page.pageSize])

  //get Users Api
  const getUsers = async (
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
        `${GET_USER_DETAILS_WITH_PAGINATION}?pageNumber=${pageNumber}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&exportRequest=${exportRequest}&searchByName=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response get users api user side")
        // console.log(res.data, "response data users api user side")

        if (exportRequest === "true") {
          const url = URL.createObjectURL(
            new Blob([res.data], { type: "text/csv" })
          )

          const date1 = moment(Date.now()).format("DD-MM-YYYY")
          // const time1 = moment(Date).format("h:mm a")
          // const finalDate = date1 + "-" + time1
          // console.log(finalDate, "final date")
          downloadFile(url, `NftUsers${date1}.csv`)
          return
        }

        if (res.status === 200) {
          // setUsers(res.data.data.users)
          setPage({ ...page, totalUser: res.data.data.totalItems })
          setUsers(
            res.data.data.items.map((user, index) => {
              return { ...user, serial: index + 1 }
            })
          )
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        // console.log(err, "error get users api user side")
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
    // console.log(user.accessToken,"user- delete side")
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
          getUsers(page.current, page.pageSize)
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
    getUsers(page.current, page.pageSize, filter, query)
  };

//Active InActive Templates Api 
const activeInactiveUser = async (_data, _setShow,_setActive) => {
  // setLoader(true)
  console.log(_data, "_data Active Inactive user")

 let body = {
  isActive: _data.status,
  id: _data.id,
 }

  let user = JSON.parse(localStorage.getItem("authUser"))
  await axios
    .post(`${ACTIVE_INACTIVE_USER}`,body, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
    .then(res => {
      console.log(res, "response Active User side ")
      getUsers(page.current, page.pageSize)
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
      name: "Email Id",
      selector: row => {
        return (
          <div className="d-flex align-items-center">
            {/* <img
            src={img3}
            className="avatar-sm me-1 rounded-circle"
            alt="img"
        /> */}
            <div className="">
              {row.email}
              {/* <h5 className="font-size-14">Charles Studd </h5> */}
            </div>
          </div>
        )
        // return row.email
      },
    },
    {
      name: "Created At",
      selector: row => fullDateFormat(row.createdAt),
    },
    {
      name: "Status",
      selector: row => (
        <>
          <CSwitchCustom
            isActive={row.isActive}
            id={row._id}
            onChange={activeInactiveUser}
          />
        </>
      ),
    },
    {
      name: "Action",
      selector: row => (
        <>
          <ul className="list-unstyled hstack gap-1 mb-0">
            <li>
              <Link
                to={`/user-view/${row._id}`}
                onClick={() => {
                  localStorage.setItem("view-User", row.email)
                }}
              >
                <i style={{ color: "grey" }} className="fas fa-eye"></i>
              </Link>
            </li>
            <li>
              <Link to={`/update-user/${row._id}`}>
                <i className="bx bxs-pencil"></i>
              </Link>
            </li>
            <li>
              <Link to="#">
                <img className="delImg" onClick={() => {
                  setUserId(row._id)
                  setShowUserDelete(true)
                }} src={deleteImg} alt="" />
              </Link>
            </li>
          </ul>
        </>
      ),
    },
  ]

  // console.log(users, "users state users side ")
  return loader2 || (loader && !users.length) ? (
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

      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom py-2">
                  <div className="">

                    <h5 className="mt-2 mb-0" style={{ fontSize: "18px" }}>Users</h5>


                    <div className="search-box-date me-xxl-2 mt-4 my-xxl-0 d-flex align-items-center justify-content-between">
                      <div
                        className="filterDiv position-relative "
                        style={{
                          marginTop: "22px",
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

                            />
                          </DateRangePicker>
                          <CInputGroupText>
                            <img
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                if (!calendarIsShowing && dateFilter.length) {
                                  setDateFilter([])
                                  getUsers(page.current, page.pageSize, [])
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
                          getUsers(
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
                    data={users}
                    paginationDefaultPage={page.current}
                    paginationPerPage={page.pageSize}
                    pagination={true}
                    progressPending={loader}
                    paginationServer
                    paginationTotalRows={page.totalUser}
                    onChangePage={e => setPage({ ...page, current: e })}
                    paginationRowsPerPageOptions={[10, 20, 30, 40]}
                    onChangeRowsPerPage={e => setPage({ ...page, pageSize: e })}
                    progressComponent={<ClipLoader />}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

Transaction.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Transaction)
