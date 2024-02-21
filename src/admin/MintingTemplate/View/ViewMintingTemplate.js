import React from "react"
import CIcon from '@coreui/icons-react'
import { CCard, CCardBody } from "@coreui/react"
import { cilTrash, cilPen } from '@coreui/icons'
import { useEffect, useState } from "react"
import "./viewTemplate.scss"
import tempImg from "../../../assets/temp.png"
import { Container, Row } from "reactstrap"
// import { Card, CardBody, Col, Row} from "reactstrap";
import { GET_MINTING_TEMPLATE, API_BASE_URL, UPDATE_MINTING_TEMPLATE, DELETE_MINTING_TEMPLATE } from "admin/Api/api"
import axios from "axios"
import { toast } from "react-toastify"
import { useProvider } from "admin/context/ProviderApp"
import { useHistory } from "react-router-dom"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import { Loader } from "admin/Loader/Loader"
export const ViewMintingTemplate = () => {
  //meta title
  // document.title = "Minting Templates"
  const history = useHistory()
  const { addMintTemplate, setAddMintTemplate } = useProvider()
  const [loader, setLoader] = useState(true)
  const [mintingTemplate, setMintingTemplate] = useState([])
  const [deletedMintTemplate, setDeletedMintTemplate] = useState(false)
  const [show, setShow] = useState(false)
  const [mintingTempId, setMintingTempId] = useState("")

  useEffect(() => {
    getMintingTemplate()
  }, [])

  const getMintingTemplate = async () => {
    try {
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))
      const response = await axios.get(`${GET_MINTING_TEMPLATE}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      // console.log(response, "response get mint temp")

      if (response.status === 200) {
        toast.success(response.message)
        setMintingTemplate([...response.data.data.items])
        setAddMintTemplate(false)
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }
  // console.log(mintingTemplate, "mintingTemplate--view side")


  const deleteMintingTemplate = async (e) => {
    try {
      setLoader(true)
      // console.log(mintingTempId,"mintingTempId-")
      e.preventDefault()
      let user = JSON.parse(localStorage.getItem("authUser"))

      const response = await axios.delete(`${DELETE_MINTING_TEMPLATE}?id=${mintingTempId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      // console.log(response, "response delete Minting template side ")
      if (response.status === 200) {
        toast.success(response.data?.message)
        // setDeletedMintTemplate(true)
        getMintingTemplate()
        setShow(false)
      }
    } catch (error) {
      // console.log(error, "error Minting template side")
      toast.error(error.message ? error.message : error)
    } finally {
      setLoader(false)
    }
  }


  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>

      <ConfirmModal text={"Delete Template"} onSubmit={deleteMintingTemplate} show={show} setShow={setShow} />
      <div className="page-content ">
        <Container fluid>

          <div className="div1  d-flex justify-content-between align-items-center">
            {/* <strong style={{ fontWeight: "bolder", fontSize: "initial" }}>View Template</strong> */}
            <h5 style={{ fontSize: "18px" }} >Minting Templates</h5>
            <button
              className="btn btn-primary"
              onClick={() => {
                history.push("/add-minting-templates")
              }}
            >
              Add Template
            </button>
          </div>
          <Row className="mt-2">
            <div className="col-xl-12 col-lg-12 card token-setting mx-auto mb-xl-4 mb-2 rounded viewTemplate">
              <CCard className="mb-2 border-0 pt-2">
                <CCardBody>
                  <div className="">
                    <div className="row align-items-start justify-content-center">
                      {/* <label htmlFor="theme" className="mb-2">
                        <strong>Minting Templates</strong>{" "}
                      </label> */}
                      <div className="row mt-2">
                        {mintingTemplate.map((content, i) => (
                          <React.Fragment key={i}>
                            <div className="col-lg-4 col-md-3 overflow-hidden p-2">
                              <label className="mx-auto d-block">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="select"
                                  id="exampleRadios1"
                                  value="option1"
                                // checked
                                />
                                <div className="template-screen">
                                  <img
                                    className="checkmark"
                                    src={`${API_BASE_URL}/uploads/common/${content.templateImage}`}
                                    alt="img"
                                  />
                                </div>
                                <h6 className="iconClass text-center mt-2 fw-bold">
                                  {content.templateName}

                                  <span className="svgIcons">
                                    <CIcon
                                      style={{ cursor: "pointer" }}
                                      icon={cilPen}
                                      className="text-warning hand me-2"
                                      onClick={() => {
                                        localStorage.setItem("mintingTempId", content._id)
                                        history.push(`/minting-template-update`)
                                      }}
                                    />
                                    <CIcon
                                      icon={cilTrash}
                                      style={{ cursor: "pointer" }}
                                      className="text-danger hand"
                                      onClick={() => {
                                        setShow(true)
                                        setMintingTempId(content._id)

                                      }}
                                    />
                                  </span>
                                </h6>
                              </label>
                            </div>
                          </React.Fragment>
                        ))}
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
