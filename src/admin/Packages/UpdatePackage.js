/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"
import { Form, Field, FormikProvider, Formik } from "formik"
import { BsArrowLeftCircleFill } from "react-icons/bs"

import { useLocation } from "react-router-dom"
import {
  FEATURE_LIST_FOR_PACKAGES,
  GET_PACKAGE_DETAILS_WITH_ID,
  GET_ASSIGN_FEATURE,
  POST_ASSIGN_FEATURE,
} from "admin/Api/api"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CFormCheck,
  CFormInput,
  CRow,
} from "@coreui/react"
import "./updatePackage.css"
import { Link } from "react-router-dom"


import { CardHeader } from "reactstrap"

import axios from "axios"
import { PackageForm2 } from "./PackageForm2"
import { groupBy } from "admin/Common/utility"
import { Loader } from "admin/Loader/Loader"



export const UpdatePackage = props => {

  const { id } = useParams()
  const [packageId, setPackageId] = useState(id)
  const [loader, setLoader] = useState(false)
  const [data, setData] = useState([])
  const [selectedPackageFeature, setSelectedPackageFeature] = useState([])
  const [currentPackageDetails, setCurrentPackageDetails] = useState([])


  const [isVisible, setIsVisible] = useState(true)
  const [section, setSection] = useState([])
  const [editModal, setEditModal] = useState({
    isVisible: false,
    id: null,
  })

  const [dataNft, setDataNft] = useState({
    numberOfCollection: 1,
    numberOfEdition: 100,
  })

  const handleOnchange = value => {
    setDataNft({
      numberOfCollection: value,
    })
  }
  const handleOnchange2 = value => {
    setDataNft({
      numberOfEdition: value,
    })
  }
  const getListForPackages = async id => {
    try {
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))
      let response = await axios.get(
        `${FEATURE_LIST_FOR_PACKAGES}?pageNumber=${1}&pageSize=${20}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      // console.log(response, "response--feature list for packages ")
      if (response.status === 200) {
        const featureTypeGroups = groupBy(response.data.data.items, "type.name")
        setData(
          Object.keys(featureTypeGroups).map(type => ({
            label: type,
            options: featureTypeGroups[type].map(feature => ({
              value: feature._id,
              label: feature.name,
            })),
          }))
        )
        await getPackageAssignFeatures(id)
      }

      // setApiSuccess()
    } catch (err) {
      console.log(err, "err get list api side ")
      // setApiFailed(err.message)
    } finally {
      setLoader(false)

    }
  }

  const getPackageAssignFeatures = async id => {
    try {
      let user = JSON.parse(localStorage.getItem("authUser"))

      let response = await axios.get(`${GET_ASSIGN_FEATURE}?planId=${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      // console.log(response, "response--get package assign features")

      if (response.status === 200) {
        setSelectedPackageFeature(response.data?.data?.map(data => data._id))
      }



    } catch (error) {
      console.log(error, "error get selected package detais")
    }
  };

  const getPackageDetailsWithId = async (id) => {
    try {
      let user = JSON.parse(localStorage.getItem("authUser"))

      let response = await axios.get(`${GET_PACKAGE_DETAILS_WITH_ID}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      // console.log(response, "response--get package details")

      if (response.status === 200) {
        setCurrentPackageDetails(response.data.data)
      }
    } catch (error) {
      console.log(error, "error get selected package detais")
    }
  };

  const handleFeatureToggle = async (feature) => {
    try {
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))
      let body = {
        featureId: feature.value,
        planId: packageId,
      }
      // console.log(body, "body--")
      let response = await axios.post(`${POST_ASSIGN_FEATURE}`, body, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      // console.log(response, "response--package assign feature details")

      if (response.status === 200) {
        getPackageAssignFeatures(packageId)

        toast.success("Updated Successfully")

      }
    } catch (error) {
      // console.log(error, "error get selected package detais")
    } finally {
      setLoader(false)

    }

  }

  const [featureSection, setFeatureSections] = useState()


  useEffect(() => {
    getListForPackages(packageId)
  }, [])

  useEffect(() => {
    getPackageDetailsWithId(packageId)
  }, [])




  // console.log(selectedPackageFeature, "selectedPackageFeature--")
  // console.log(data, "data-- update package side")

  // console.log(isVisible, "isVisible--")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <div className="page-content ">

        <Container fluid>
          {/* <div className=" mb-2 d-flex justify-content align-items-center">
            <h5 style={{ fontSize: "21px" }}>
              Package Features Update
              <CButton
                type="button"
                onClick={() => {
                  setIsVisible(true)
                }}
                variant="light"
                className="editPackage p-0  ms-3"
              >
                <CIcon
                  icon={cilPencil}
                  className="text-warning"
                  customClassName=""
                  width={18}
                />
              </CButton>
            </h5>
            
          </div> */}
          <div style={{marginTop:"4px"}} className="div1 mb-0 d-flex justify-content-between align-items-center">

            <div style={{gap:"11px"}} className="leftBackArrow d-flex">
            <Link to= {"/active-packages"}>
              <BsArrowLeftCircleFill
                style={{
                  color: "#0d6efd",
                  fontSize: "25px",
                  cursor: "pointer",
                }}
              />
            </Link>

              <h5 style={{ fontSize: "18px",paddingTop:"3px" }} >Update Additional Features</h5>
            </div>


            <button
              className="btn btn-primary"
              onClick={() => {
                setIsVisible(true)

              }}
            >
              Update Package
            </button>
          </div>
          <Row className="mt-4">
            <div className="col-xl-12 col-lg-12 card token-setting mx-auto mb-xl-4 mb-2 rounded viewTemplate">
              <CCard className="featureCard mb-2 border-0 pt-2">
                <CCardBody>
                  {/* <div className="text-center">
                    Addition Features
                   </div> */}
                  <div className="">
                    <div className="row align-items-start justify-content-center">
                      {/* <label htmlFor="theme" className="mb-2">
                        <strong>Minting Templates</strong>{" "}
                      </label> */}
                      <div className="row mt-2">
                        <React.Fragment>
                          <CRow className="">
                            {data.length === 0 ? (<>
                              <span className="text-center">There are no records to display</span>
                            </>) :
                              <>
                                {data.map(data => (
                                  <CCol xs={4} key={data.label}>
                                    <CCard>
                                      <CardHeader>
                                        <CCardTitle className="featureTitle">
                                          {data.label}
                                        </CCardTitle>
                                      </CardHeader>
                                      <CCardBody>
                                        {data.options.map((opt,i) => (
                                          <div key={i}>
                                            {/* {console.log(selectedPackageFeature.includes(opt.value), "check")} */}
                                            <CFormCheck
                                              checked={selectedPackageFeature.includes(opt.value)}
                                              onClick={() => {
                                                // console.log('onchange side ')
                                                handleFeatureToggle(opt)
                                              }}
                                              onChange = {()=>{}}
                                              label={opt.label}
                                            />
                                          </div>
                                        ))}

                                      </CCardBody>
                                    </CCard>
                                  </CCol>
                                ))}
                              </>
                            }
                          </CRow>
                        </React.Fragment>
                        <PackageForm2
                          setVisible={setIsVisible}
                          isVisible={isVisible}
                          setLoader={setLoader}
                          loader={loader}
                          packageId={packageId}
                          currentPackageDetails={currentPackageDetails}
                        />
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </Row>
        </Container>
      </div>
    </>
  )
}
