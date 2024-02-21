import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"
import { useProvider } from "admin/context/ProviderApp"

import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap"

import { Loader } from "admin/Loader/Loader"
import DataTable from "react-data-table-component"
import '../../admin/Users/Users/Users'
import ClipLoader from "react-spinners/ClipLoader"
import "flatpickr/dist/themes/material_blue.css"
import {
  fullDateFormat,
} from "admin/Common/utility"
import { withTranslation } from "react-i18next"
import axios from "axios"



import { GET_USER_DETAILS_WITH_PAGINATION } from "admin/Api/api"

import { toast } from "react-toastify"

const DashboardTransaction = props => {
  //meta title
  // document.title = "Users"
  const { loader, setLoader } = useProvider()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState({ current: 1, totalItems: 0, pageSize: 5 })

  useEffect(() => {
    getUsers(page.current, page.pageSize)
  }, [page.current, page.pageSize])

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

    await axios
      .get(
        `${GET_USER_DETAILS_WITH_PAGINATION}?pageNumber=${pageNumber}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&exportRequest=${exportRequest}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then(res => {
        // console.log(res, "response get users api user side")
        // console.log(res.data, "response data users api user side")

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


  const columns = [
    {
      name: "Sr. No",
      selector: row => {
        return row.serial + (page.current - 1) * page.pageSize
      },
    },
    // {
    //   name: "User Id",
    //   selector: row => {
    //     return row.userName || row.firstName
    //   },
    // },
    {
      name: "Email Id",
      selector: row => {
        return row.email
      },
    },
    {
      name: "Package",
      selector: row => {
        return "Silver"
      },
    },
    {
      name: "Amount",
      selector: row => (
        <>
          <span>$20</span>
        </>
      ),
    },
    {
      name: "Payment Status",
      selector: row => (
        <>
        <Button className="btn btn-success" style={{padding:"4px"}} > Success</Button>
          {/* <CSwitch
            serial={row.serial}
            userId = {row._id}
            isActive = {row.isActive}
           
          /> */}
        </>
      ),
    },
    {
      name: "Paid On ",
      selector: row => fullDateFormat(row.createdAt),
    },
    
  ]

  // console.log(users, "users state users side ")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <React.Fragment>
      <div className="dashboard-transac" style={{padding:""}}>
        <div className="">
          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom py-2">
                  <div className="">
                    <h5 className="mb-0 card-title flex-grow-1"> Recent Transactions </h5>

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
                    // progressPending={apiStatus.inProgress}
                    paginationServer
                    paginationTotalRows={page.totalUser}
                    onChangePage={e => setPage({ ...page, current: e })}
                    paginationRowsPerPageOptions={[5,10, 15, 20]}
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

DashboardTransaction.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(DashboardTransaction)
