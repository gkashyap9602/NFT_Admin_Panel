import React from "react"
import {
  CCard,
  CCardBody,
  CCol,
  CFormSelect,
  CRow,
  CTooltip,
  CButton,
} from "@coreui/react"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import CIcon from "@coreui/icons-react"
import "./collectionDetails.scss"
import { capitalize } from "admin/Common/utility"
import { BsArrowUpRightCircleFill,BsArrowLeftCircleFill } from "react-icons/bs"
import { IoArrowBackSharp } from "react-icons/io5"

export const CollectionDetails = props => {
  const { collectionDetails,setViewInfo } = props

  // console.log(collectionDetails,"collectionDetails-side")
  return (
    <>
      <div className="page-content">
        <CRow className="editUser">
          <CCol md={12}>
            <CCard className="col-xl-12 col-lg-12 mx-auto mb-4 rounded shadow-md p-2">
              <CCardBody>
                <div className="bg-white pb-4">
                <div className="collectionBack d-flex" style={{ gap: "15px" }}>
                    <BsArrowLeftCircleFill
                      style={{ fontSize: "25px", cursor: "pointer" }}
                      onClick={() => {
                        setViewInfo({
                          status: false,
                          id: "",
                        })
                      }}
                    />
                       <h5 style={{fontSize:"18px"}} >Collection Details</h5>
                 </div>
                
                </div>

                <ul className="data-details-list">
                  <li>
                  
                    <div className="data-details-head">Collection Name</div>
                    <div className="data-details-des">
                      {" "}
                      {collectionDetails.name
                        ? capitalize(collectionDetails.name)
                        : ""}
                    </div>
                  </li>
                  <li>
                    <div className="data-details-head">Website Domain</div>
                    <div className="data-details-des">
                    
                    {collectionDetails.websiteDomain?collectionDetails.websiteDomain:""}
                   {collectionDetails.websiteDomain?
                      <a
                        target="blank"
                        href={collectionDetails.websiteDomain}
                        style={{ marginLeft: "3px" }}
                        className="domainLaunch"
                      >

                        <BsArrowUpRightCircleFill />

                      </a>:""}
                    </div>
                  </li>
                  <li>
                    <div className="data-details-head">Contract Address</div>
                    <div className="data-details-des">
                      {collectionDetails.contractAddress
                        ? collectionDetails.contractAddress
                        : ""}
                    </div>
                  </li>
                  <li>
                    <div className="data-details-head">IsGenerated</div>
                    <div className="data-details-des">
                      {collectionDetails.isGenerated
                        ? collectionDetails.isGenerated.toString()
                        : ""}
                    </div>
                  </li>

                  <li>
                    <div className="data-details-head">IsLaunched</div>
                    <div className="data-details-des">
                      {collectionDetails.isLaunched?collectionDetails.isLaunched.toString():"false"}
                    </div>
                  </li>
                </ul>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </>
  )
}
