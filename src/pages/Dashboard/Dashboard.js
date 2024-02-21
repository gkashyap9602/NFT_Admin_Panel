import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CWidgetStatsF,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilPeople, cilBank, cibDropbox } from "@coreui/icons"

import PieChart from "./PieChart"
import "./dashboard.css"
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from "reactstrap"

//import action
import { getChartsData as onGetChartsData } from "../../store/actions"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

//redux
import { useSelector, useDispatch } from "react-redux"
import DashboardTransaction from "pages/Dashboard/DashboardTransaction"

const Dashboard = props => {
  const [modal, setmodal] = useState(false)
  const [subscribemodal, setSubscribemodal] = useState(false)

  const { chartsData } = useSelector(state => ({
    chartsData: state.Dashboard.chartsData,
  }))


  useEffect(() => {
    setTimeout(() => {
      setSubscribemodal(true)
    }, 2000)
  }, [])

  const [periodData, setPeriodData] = useState([])
  const [periodType, setPeriodType] = useState("yearly")

  useEffect(() => {
    setPeriodData(chartsData)
  }, [chartsData])

  const onChangeChartPeriod = pType => {
    setPeriodType(pType)
    dispatch(onGetChartsData(pType))
  }

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(onGetChartsData("yearly"))
  }, [dispatch])

  //meta title
  // document.title = "Dashboard "

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />
          <CRow className="align-items-start justify-content-center position-relative">
            <CCol lg={12} xl={8} xxl={8} xxxl={9}>
              <CCard className="mb-4">
                <CCardBody className="p-2 overflow-hidden">
                  <CRow className="align-items-center justify-content-center position-relative">
                    <div className="total-supply">
                      <div className="row">
                        <div className="col-3">
                          <div
                            className="chart_data"
                            style={{ borderLeft: "4px solid #34c38f" }}
                          >
                            <h4>
                              Total Clients <br />
                            </h4>
                            <span className="total-supply-value">{44}</span>
                          </div>
                        </div>
                        <div className="col-3">
                          <div
                            className="chart_data"
                            style={{ borderLeft: "4px solid #f1b44c" }}
                          >
                            <h4>
                              Total Sale <br />
                            </h4>
                            <span className="total-supply-value">{33}</span>
                          </div>
                        </div>
                        <div className="col-3">
                          <div
                            className="chart_data"
                            style={{ borderLeft: "4px solid #f46a6a" }}
                          >
                            <h4>
                              Packages <br />
                            </h4>
                            <span className="total-supply-value">{3}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CCol className=" position-relative mb-3 mb-lg-0 chart_symbol py-5">
                      {/* <div className="total-supply">
                        <h4 className=" position-absolute">
                          Clients <br />
                          <span className="total-supply-value">{"totalClients"}</span>
                        </h4>
                      </div> */}
                      <PieChart
                        dataColors='["#20c997","#37b9d7", "#f3ba2f", "#ced4da" ]'
                        // type="doughnut"
                        // width={4}
                        // data={{
                        //   labels: "PackageName",
                        //   datasets: [
                        //     {
                        //       backgroundColor: ['#29cc97', '#39f', '#AA73F2', '#5b1761'],
                        //       data: "clientCount",
                        //     },
                        //   ],
                        // }}
                      />
                    </CCol>
                    {/* <CCol xxl={4} xl={5} lg={12} className="offset-xxl-1 offset-0 ">
                      <CRow className="text-start content_supply">
                        <CCol className="col-xxl-12 col-xl-12 col-md-6 col-12">
                          <CCallout
                            className="hand"
                            onClick={() => navigate('/clients')}
                            color="primary"
                          >
                            Total Clients <br />
                            <h3> {"totalClients"} </h3>
                          </CCallout>
                        </CCol>
                        <CCol className="col-xxl-12 col-xl-12 col-md-6 col-12">
                          <CCallout
                            className="hand"
                            onClick={() => navigate('/payments')}
                            color="success"
                          >
                            Total Sale <br />
                            <h5> {"humanReadableNumber(totalSales ? totalSales : '0')"} </h5>
                          </CCallout>
                        </CCol>
                        <CCol className="col-xxl-12 col-xl-12 col-md-6 col-12">
                          <CCallout className="hand" onClick={() => navigate('/prospects')}>
                            Prospect <br />
                            <h5> {"humanReadableNumber(prospectClients)"} </h5>
                          </CCallout>
                        </CCol>
                        <CCol className="col-xxl-12 col-xl-12 col-md-6 col-12 ">
                          <CCallout
                            onClick={() => navigate('/packages/list')}
                            color="danger"
                            className="hand"
                          >
                            Packages <br />
                            <h5> {"humanReadableNumber(totalSubscriptions)"} </h5>
                          </CCallout>
                        </CCol>
                      </CRow>
                    </CCol> */}
                    <CCol xl={1}></CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={12} xl={4} xxl={4} xxxl={3} className="right_cards">
              <CRow className="">
                {/* {info.map((val, index) => { */}
                {/* return ( */}
                <CCol md={6} lg={6} xxl={12} xl={12} sm={6} xs={12}>
                  <CWidgetStatsF
                    // key={index}
                    className="mb-xl-3 mb-2 dashboard_hand"
                    color={"success"}
                    value={"44"}
                    icon={<CIcon icon={cilPeople} height={24} />}
                    title={"Total Client"}
                    onClick={() => navigate("val.target")}
                  />
                </CCol>
                <CCol md={6} lg={6} xxl={12} xl={12} sm={6} xs={12}>
                  <CWidgetStatsF
                    // key={index}
                    className="mb-xl-3 mb-2 dashboard_hand"
                    color={"warning"}
                    value={"30"}
                    icon={<CIcon icon={cilBank} height={24} />}
                    title={"Total Sale"}
                    onClick={() => navigate("val.target")}
                  />
                </CCol>
                <CCol md={6} lg={6} xxl={12} xl={12} sm={6} xs={12}>
                  <CWidgetStatsF
                    // key={index}
                    className="mb-xl-3 mb-2 dashboard_hand"
                    color={"danger"}
                    value={"3"}
                    icon={<CIcon icon={cibDropbox} height={24} />}
                    title={"Packages"}
                    onClick={() => navigate("val.target")}
                  />
                </CCol>

                {/* ) */}
                {/* })} */}
              </CRow>
            </CCol>
          </CRow>
          {/* <Row>
            <Col xl="4">
              <MonthlyEarning />
            </Col>
            <Col xl="8">
              <Row>
               
                {reports.map((report, key) => (
                  <Col md="4" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card>
                <CardBody>
                  <div className="d-sm-flex flex-wrap">
                    <h4 className="card-title mb-4">Email Sent</h4>
                    <div className="ms-auto">
                      <ul className="nav nav-pills">
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={classNames(
                              { active: periodType === "weekly" },
                              "nav-link"
                            )}
                            onClick={() => {
                              onChangeChartPeriod("weekly");
                            }}
                            id="one_month"
                          >
                            Week
                          </Link>{" "}
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={classNames(
                              { active: periodType === "monthly" },
                              "nav-link"
                            )}
                            onClick={() => {
                              onChangeChartPeriod("monthly");
                            }}
                            id="one_month"
                          >
                            Month
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={classNames(
                              { active: periodType === "yearly" },
                              "nav-link"
                            )}
                            onClick={() => {
                              onChangeChartPeriod("yearly");
                            }}
                            id="one_month"
                          >
                            Year
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <StackedColumnChart periodData={periodData} dataColors='["--bs-primary", "--bs-warning", "--bs-success"]' />
                </CardBody>
              </Card>
            </Col>
          </Row> */}

          <Row>
            <Col lg="12">
              {/* <LatestTranaction /> */}
              <DashboardTransaction />
            </Col>
          </Row>
        </Container>
      </div>

      {/* subscribe ModalHeader */}

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal)
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal)
            }}
          >
            Order Details
          </ModalHeader>

          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal)
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Dashboard)
