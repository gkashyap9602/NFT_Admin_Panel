import PropTypes from "prop-types"
import React,{useState} from "react"
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"
import { FORGOT_PASSWORD } from "admin/Api/api"
import { withRouter, Link } from "react-router-dom"
import { RESET_PASSWORD } from "admin/Api/api"
import { useHistory } from "react-router-dom"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

import { useLocation } from "react-router-dom"

import { Loader } from "admin/Loader/Loader"
// action
import { userForgetPassword } from "../../store/actions"
import logo2 from "../../assets/Logo.png"

// import images
import profile from "../../assets/images/profile-img.png"
import logo from "../../assets/images/logo.svg"
import axios from "axios"
import { toast } from "react-toastify"

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
const ResetPasswordPage = (props) => {
  //meta title
  document.title = "Reset Password | NFT Admin Panel"
  ////
  const dispatch = useDispatch()

let history = useHistory()
let query = useQuery();
// console.log(query,"query--reset password")
// console.log(query.get("resetId"),"query--resetId ")

const [resetPasswordToken,setResetPasswordToken] = useState(query.get("resetId"))
const [loader,setLoader] = useState(false)

  const ResetPassword = async(_values)=>{
    // console.log(_values,"values-- forgot Password Side")
    try {

        setLoader(true)
      let response = await axios.post(`${RESET_PASSWORD}`,{password:_values.password},{
        headers: { Authorization: `Bearer ${resetPasswordToken}` },
      })
      console.log(response,"response reset password api side ")
      if(response.status ===200){
        history.push("login")
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.error : error)
      console.log(error,"error reset password")
    }finally{
        setLoader(false)
    }
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Please enter password to continue"),
    }),
    onSubmit: values => {
      dispatch(ResetPassword(values))
    },
  })

  const { forgetError, forgetSuccessMsg } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }))

//   console.log(resetPasswordToken,"resetPassw token")
  return loader?(
    <>
    <Loader/>
    </>
  ):(
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="p-4">
                        <h5 style={{color:"#fff"}} className="">Reset Your Password!</h5>
                        <p>Enter New Password to continue </p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo2}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label"> Password</Label>
                        <div className="position-relative">

                        </div>
                        <Input
                          name="password"
                          className="form-control"
                          placeholder="Enter New Password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password && validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <div style={{gap:"60px"}} className="mt-5 text-center d-flex justify-content-center ">
                            {/* <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p> */}
                            {/* <Link
                              to="login"
                              className="font-weight-medium text-primary"
                            >
                              <button
                              style={{backgroundColor:"#37b9d7",color:"white"}}
                                className="btn w-md "
                                type="submit"
                              >
                                Cancel
                              </button>
                            </Link> */}

                            <button
                            style={{color:"white"}}
                              className="btn btn-primary "
                              type="submit"
                              // onClick={()=>{
                              //   forgotPassword()
                              // }}
                            >
                              Reset Password
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                  {/* <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                
              </div> */}
                </CardBody>
              </Card>
              {/* <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                
              </div> */}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

ResetPasswordPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(ResetPasswordPage)
