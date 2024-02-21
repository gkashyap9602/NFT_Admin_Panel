import React, { useState, useRef, useEffect } from "react"
import { CCard, CCardBody, CCol, CRow, CFormCheck } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import { Row, Col } from "reactstrap"
import Dropzone from "react-dropzone"
import cloud from "../../assets/cloud.svg"
import paypal from "../../assets/paypal.png"
import upload1 from "../../assets/upload3.webp"
import "./ViewMethod.css"
import * as Yup from "yup"
import { cilPencil, cilTrash, cilPen, cilPenAlt, cilMoney } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

// import {Toastco}
import { toast } from "react-toastify"
// import "./addTemplate.scss"
// import { changeApiStatus } from "admin/utility"
// import tempImg from "../../assets/temp.png"
import {
  ADD_MINTING_TEMPLATE,
  GET_PAYMENT_METHOD,
  API_BASE_URL,
  DELETE_PAYMENT_METHOD,
} from "admin/Api/api"
import axios from "axios"
import { useProvider } from "admin/context/ProviderApp"
import { useHistory } from "react-router-dom"
import { Loader } from "admin/Loader/Loader"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import { AddMethod } from "./AddMethod"
export const ViewMethod = () => {
  const history = useHistory()

  const [showPaymentDelete, setShowPaymentDelete] = useState(false)
  const [paymentMehtodId, setPaymentMethodId] = useState("")
  const [loader, setLoader] = useState(false)
  const [image, setImage] = useState({
    blob: null,
    src: "",
  })

  const [paymentMethods, setPaymentMethods] = useState([])

  useEffect(() => {
    getPaymentMethods()
  }, [])

  const getPaymentMethods = async () => {
    try {
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))
      const response = await axios.get(`${GET_PAYMENT_METHOD}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      // console.log(response, "response get Payment Method side ")

      if (response.status === 200) {
        toast.success(response.message)
        setPaymentMethods([...response.data.data.items])
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      // console.log(err,"get Payment Method side ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }

  const deletePaymentMethod = async e => {
    try {
      e.preventDefault()
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))

      const response = await axios.delete(
        `${DELETE_PAYMENT_METHOD}?id=${paymentMehtodId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      // console.log(response, "response Delete Payment Method  side ")
      if (response.status === 200) {
        toast.success(response.data?.message)
        getPaymentMethods()
      }
    } catch (error) {
      // console.log(error, "error Delete Payment Method  side")
      toast.error(error.message ? error.message : error)
    } finally {
      setLoader(false)
      setShowPaymentDelete(false)
    }
  }

  // console.log(image, "image--template")
  // console.log(paymentMethods,"paymentMethods- view payment method side ")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <ConfirmModal
        text={"Delete Payment Method"}
        onSubmit={deletePaymentMethod}
        show={showPaymentDelete}
        setShow={setShowPaymentDelete}
      />
      <div className="page-content">
        <div className="div1 text-end mb-0 d-flex justify-content-between align-items-center">
          {/* <div className="bg-white pb-3 text-center"> */}
          <h5 style={{ fontSize: "18px" }} className="mb-0">
            View Payment Method
          </h5>
          {/* </div> */}
          <button
            className="btn btn-primary"
            onClick={() => {
              history.push("/add-payment-method")
            }}
          >
            Add Payment Method
          </button>
        </div>
        <CCard className="cardImage mb-0 mt-2">
          <CCardBody className="payment_img">
            <div className="grid-system row mt-0 justify-content-center">
              {paymentMethods.map((payment, index) => (
                <React.Fragment key={1}>
                  <div className="text-center col-lg-3 mt-2 ">
                    <div className="paymentItem position-relative">
                      <div className="payment_text">{payment.name}</div>

                      <div htmlFor="check1" className="text-center">
                        {/* <img src={panda} alt="" className="img-fluid" /> */}
                        <img
                          className="editNftImage"
                          src={`${API_BASE_URL}/uploads/common/${payment.image}`}
                          alt=""
                        />
                      </div>
                      <span className="svgIconsPayment">
                        <CIcon
                          style={{ cursor: "pointer" }}
                          icon={cilPen}
                          className="text-warning hand me-2"
                          onClick={() => {
                            history.push(
                              `/update-payment-method/${payment._id}`
                            )
                          }}
                        />
                        <CIcon
                          icon={cilTrash}
                          style={{ cursor: "pointer" }}
                          className="text-danger hand"
                          onClick={() => {
                            setShowPaymentDelete(true)
                            setPaymentMethodId(payment._id)
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </CCardBody>
        </CCard>
      </div>

    </>
  )
}
