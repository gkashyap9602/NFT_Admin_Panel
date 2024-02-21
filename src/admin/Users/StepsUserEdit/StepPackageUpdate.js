import React, { useEffect, useState } from "react"

import { CButton, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import packagebg from "../../../assets/package_bg.svg"
import { cilPencil, cilTrash } from "@coreui/icons"
import "./StepPackageUpdate.scss"
import "./StepPackageUpdate.css"
import classNames from "classnames"
import { Container } from "reactstrap"

import { HiCheckBadge } from "react-icons/hi2";

import { ImCross } from "react-icons/im";
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import { Loader } from "admin/Loader/Loader"
import { toast } from "react-toastify"
import { GET_PACKAGES, DELETE_PACKAGE } from "admin/Api/api"
import { useHistory } from "react-router-dom"
import axios from "axios"
export const StepPackageUpdate = props => {
  //meta title
  // document.title = "Packages"
  //   const navigator = useNavigate()
  const history = useHistory()
  const [data, setData] = useState([])
  //   const { apiStatus, setApiSuccess, setApiFailed, setInProgress } =
  //     useApiStatus()
  const [editModal, setEditModal] = useState({
    isVisible: false,
    id: null,
  })

  const [isVisible, setIsVisible] = useState(false)
  const [loader, setLoader] = useState(true)
  const [page, setPage] = useState({ current: 1, pageSize: 10 })
  const [showPackageDelete, setShowPackageDelete] = useState(false)
  const [packageId, setPackageId] = useState("")

  useEffect(() => {
    getPackages(page.current, page.pageSize)
  }, [])

  const getPackages = async (pageNumber, pageSize, isDeleted = "false") => {
    try {
      setLoader(true)
      // console.log(pageNumber,pageSize,isDeleted, "pageNumber,pageSize,isDeleted")
      let user = JSON.parse(localStorage.getItem("authUser"))
      let response = await axios.get(
        `${GET_PACKAGES}?pageNumber=${pageNumber}&pageSize=${pageSize}&isDeleted=${isDeleted}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        // console.log(response, "response Get package side ")
        // toast.success(response.data?.message)
        setData(response.data.data)
      }
    } catch (err) {
      // console.log(err, "error add Package side  ")
      // toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }

  const deletePackage = async (_packageId, _hardDelete = "false") => {
    try {
      // console.log(packageId,"packageId")
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))
      let response = await axios.delete(
        `${DELETE_PACKAGE}?id=${packageId}&hardDelete=${_hardDelete}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        // console.log(response, "response Get package side ")
        toast.success(response.data?.message)
        getPackages(page.current, page.pageSize)
      }
    } catch (err) {
      // console.log(err, "error add Package side  ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
      setShowPackageDelete(false)
    }
  }

  // console.log(data,"data-packages- active packages side ")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <ConfirmModal
        text={"Delete Package"}
        onSubmit={deletePackage}
        show={showPackageDelete}
        setShow={setShowPackageDelete}
      />
      <Container fluid>
        <div className="div1 mb-3 mt-4 d-flex justify-content-between align-items-center">
          <h5 style={{ fontSize: "18px" }}>Plans-Packages</h5>
        </div>

        <div>
          <CRow className="m-auto text-center justify-content-center align-items-center">
            {data.map(pricePackage => {
              return (
                <>
                  <CCol
                    // key={pricePackage.id}
                    xl={3}
                    lg={4}
                    md={6}
                    xs={12}
                    className={classNames({
                      "princing-item": true,
                      red: true,
                    })}
                  >
                    <CCardHeader className="pricing-divider ">
                      <div
                        className={
                          pricePackage.name === "Free"
                            ? "packageRibbon_badge"
                            : "packageRibbon_badge_inactive"
                        }
                      >
                        {" "}
                        {pricePackage.name === "Free" ? "Active" : "InActive"}
                      </div>

                      <CRow className="justify-content-between mx-0">
                        <CCol xs={12}>
                          <h3 className="text-light fw-bold pt-3">
                            {pricePackage.name}
                          </h3>
                          <h4 className="my-0 display-4 text-light font-weight-normal mb-3">
                            <span style={{fontSize:"40px"}} className="h3">{`$${pricePackage.price}`}</span>

                            <span className="h5">
                              /{""}
                              {pricePackage.type}
                            </span>
                          </h4>
                        </CCol>

                        <CCol xs={12}>
                          <img
                            src={packagebg}
                            alt="packagebg"
                            className="pricing-divider-img"
                          />
                        </CCol>
                      </CRow>
                    </CCardHeader>
                    <CCardBody className="bg-white mt-0 shadow px-3 pb-3">
                      <ul className="package-services-list list-unstyled mb-5 position-relative">
                        {/* {pricePackage.services.map((service, index) => ( */}
                        <span className="packStatus d-flex mb-1 align-items-center">
                            {pricePackage.manageCms ?
                              <HiCheckBadge style={{ fontSize: "18px", color: "green" }} /> :

                              <ImCross style={{ fontSize: "12px", color: "red",margin:"0px 3px" }} />}
                            <li
                            // key={index}
                            // className={
                            //   pricePackage.manageCms ? "checked" : "crossed"
                            // }

                            >
                              Manage Cms

                            </li>
                          </span>

                          <span className="d-flex mb-1 align-items-center">
                            <HiCheckBadge style={{ fontSize: "18px", color: "green" }} />
                            <li
                            // key={index}
                            // className="checked"

                            >
                              Number of Collection :{" "}
                              {pricePackage.numberOfCollections}
                              <b>

                              </b>
                            </li>
                          </span>

                          <span className="d-flex mb-1 align-items-center">
                            <HiCheckBadge style={{ fontSize: "18px", color: "green" }} />

                            <li
                            // key={index}
                            // className="checked"

                            >
                              Number of Edition : {pricePackage.numberOfEditions}

                            </li>
                          </span>

                          <span className="d-flex mb-1 align-items-center">
                          {pricePackage.customDomain ?
                              <HiCheckBadge style={{ fontSize: "18px", color: "green" }} /> :

                              <ImCross style={{ fontSize: "12px", color: "red",margin:"0px 3px" }} />}

                            <li
                              // key={index}
                              // className={
                              //   pricePackage.customDomain ? "checked" : "crossed"
                              // }

                            >
                              Custom Domain 

                            </li>
                          </span>
                          {pricePackage.featureTypes.map((feature, index) => {
                            {/* { console.log(feature, "featuretype map") } */}
                            return (<>



                              {feature.features.map((vall) => (<>

                                <span className="packStatus d-flex mb-2 align-items-center">
                                  {feature.name ?
                                    <HiCheckBadge style={{ fontSize: "18px", color: "green" }} /> :

                                    <ImCross style={{ fontSize: "12px", color: "red", margin: "0px 3px" }} />}
                                  <li
                                  // key={index}
                                  // className={
                                  //   pricePackage.manageCms ? "checked" : "crossed"
                                  // }

                                  >

                                    {`${feature.name} - ${vall.featureName}`}
                                    {/* {feature.features?.map((vall)=>{
                                vall.name
                              })} */}
                                    {/* <b>{service.meta?.value ? ` : ${service.meta?.value}` : ''}</b> */}

                                  </li>
                                </span>

                              </>))}

                            </>)

                          })}
                        {/* ))} */}
                      </ul>
                      <button
                        className="btn btn-custom-package px-4"
                        onClick={() => {
                          // history.push("/update-package")
                        }}
                      >
                        {pricePackage.name === "Free" ? "Selected" : "Select"}
                      </button>
                    </CCardBody>
                  </CCol>
                </>
              )
            })}
          </CRow>
          {/* <PackageForm
          isVisible={editModal.isVisible}
          editId={editModal.id}
          data={data}
          handleSuccess={() => {
            fetchPackages()
            setEditModal({ isVisible: false, id: null })
          }}
          handleCloseModal={() => setEditModal({ isVisible: false, id: null })}
        /> */}
        </div>
      </Container>
    </>
  )
}
