import React, { useState, useEffect } from "react"
import { Row, Col, Container } from "reactstrap"
import { CCard, CCardBody, CCol, CRow, CFormCheck } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { BrowseImages } from "../ImagePage/BrowseImages"
import { AddLayer } from "admin/Modal/AddLayer/AddLayer"
import { eventChannel } from "redux-saga"
import axios from "axios"
import { toast } from "react-toastify"
import { ADD_BROWSE_CATEGORY } from "admin/Api/api"
import { useProvider } from "admin/context/ProviderApp"
import { Loader } from "admin/Loader/Loader"
import {
  GET_BROWSE_CATEGORY,
  DELETE_BROWSE_LAYER_WITH_ID_PARAMS,
  UPDATE_BROWSE_LAYER_WITH_DATA_BODY,
} from "admin/Api/api"
export const BrowseSection = () => {
  //meta title
  // document.title = "Browse Section"
  const { setSelectedLayer,setSelectedBrowseLayer, selectedBrowseLayer, templateId } =
    useProvider()

  const SignupSchema = Yup.object().shape({
    layerName: Yup.string().required("Please Enter Category Name"),
  })
  const [data, setData] = useState("")
  const [loader, setLoader] = useState(true)
  
  // const [layer,setLayer] = useState("")
  const [show, setShow] = useState(false)
  const [layer, setLayer] = useState(false)
  const [browseLayers, setBrowseLayers] = useState([])

  const handleClose = () => {
    setShow(false)
  }

  const [del, setDel] = useState(false)
  useEffect(() => {
    // if(browseLayers.length===0){
    //   setLoader(true)

    //   setTimeout(()=>{
    //      setLoader(false)
    //   },300)
    // }
    // setSelectedLayer("")
    getBrowseLayers()
  }, [del])
  
  const getBrowseLayers = async () => {
    // setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))
    // console.log(user, "user")
    await axios
      .get(`${GET_BROWSE_CATEGORY}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        // console.log(res, "response get browse layer side ")
        setBrowseLayers(res.data?.data)
        // setLayer(false)
        setDel(false)
        // console.log(
        //   selectedBrowseLayer.layerId,
        //   "selectedBrowseLayer.layerId-get"
        // )
        if (!selectedBrowseLayer.layerId) {
          // console.log("under if browse image")
          setSelectedBrowseLayer({
            layerId: res.data?.data[0]._id,
            layerName: res.data?.data[0].layerName,
          })
        }
      })
      .catch(err => {
        // console.log(err, "err from get layer")
      })
      .finally(() => {
        setLoader(false)
      })
  }
  const addBrowseLayer = async values => {
    try {
      setLoader(true)
      // console.log(values, "values-ad")
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")
      let response = await axios.post(
        `${ADD_BROWSE_CATEGORY}`,
        { layerName: values.layer },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (response.status === 201) {
        // console.log(response, "response add layer side ")
        toast.success(response.data?.message)
        handleClose()
        // setLayer(true)
        getBrowseLayers()
        setSelectedBrowseLayer({
          ...selectedBrowseLayer,
          layerId: response.data?.data._id,
          layerName: response.data?.data.layerName,
        })
      }
    } catch (err) {
      // console.log(err, "error add category ")
      toast.error(err.response ? err.response.data.error : err)
      //   changeApiStatus(false, err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }
  const deleteBrowseLayer = async e => {
    try {
      // console.log("in delete Browse Layer")

      setLoader(true)
      e.preventDefault()
      // console.log(e.target, "delete Browse Layer side ")
      let user = JSON.parse(localStorage.getItem("authUser"))

      const response = await axios.delete(
        `${DELETE_BROWSE_LAYER_WITH_ID_PARAMS}/${selectedBrowseLayer.layerId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      // console.log(response, "response delete Layer side ")
      if (response.status === 200) {
        toast.success(response.data?.message)
        setSelectedBrowseLayer("")
        setDel(true)
        // console.log(selectedBrowseLayer, "after blank selected browse Layer")
        // getBrowseLayers()
        // setLayerDeleted(true)
        // setShow(false)
      }
    } catch (error) {
      // console.log(error, "error Delte Layer side ")
      toast.error(error.message ? error.message : error)
    } finally {
      setLoader(false)
    }
  }

  const editBrowseLayer = async (event, _layerName, _oldName) => {
    try {
      setLoader(true)
      event.preventDefault()
      // console.log(
      //   _layerName,
      //   "_layerName",
      //   _oldName,
      //   "_oldName edit browse layer side "
      // )
      let body = {
        layerId: selectedBrowseLayer.layerId,
        name: _layerName,
        oldName: _oldName,
      }
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")
      let response = await axios.post(
        `${UPDATE_BROWSE_LAYER_WITH_DATA_BODY}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        // console.log(response, "response edit layer side ")
        toast.success(response.data?.message)
        getBrowseLayers()
        setSelectedBrowseLayer({
          ...selectedBrowseLayer,
          layerId: response.data?.data._id,
          layerName: response.data?.data.layerName,
        })
        // setLayerUpdated(true)
        // setLayer(response.data.data)
      }
    } catch (err) {
      // console.log(err, "error edit layer side ")
      toast.error(err.response ? err.response.data.error : err)
      //   changeApiStatus(false, err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }

  // console.log(del, "delete status layer -browse")
  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <AddLayer
        handleClose={handleClose}
        onSubmit={addBrowseLayer}
        setShow={setShow}
        show={show}
      />
      <div className="page-content">
        <Container fluid>
          <div className="div1 mb-2 d-flex justify-content-between align-items-center">
            {/* <strong style={{ fontWeight: "bolder", fontSize: "initial" }}>
              Browse Images
            </strong> */}
          <h5 style={{fontSize:"18px"}} >Browse Images</h5>


            <button
              className="btn btn-primary"
              onClick={() => {
                setShow(true)

                // navigator(paths.getAddTemplate())
              }}
            >
              Add Layer
            </button>
          </div>
          <CRow>
            <CCol md={12}>
              {/* <Formik
                                initialValues={{ ...data }}
                                enableReinitialize
                                onSubmit={onSubmit}
                            > */}
              {/* {({
                                    errors,
                                    touched,
                                    values,
                                    data,
                                    setFieldValue,
                                    templateId: id,
                                    fields,
                                }) => ( */}
              {/* <Form> */}
              {/* <CCard className="mb-2 border-0 pt-2"> */}
              {/* <CCardBody> */}
              <div className="row">
                <div className="col-md-12">
                  {/* <div className="pb-3 text-center">
                                                    <h5 className="mb-0">Manage Template</h5>
                                                </div> */}
                  {/* <Row mt={2}>
                                                    <Col sm={8}>
                                                        <div>
                                                            <label htmlFor="templateName" className="mb-2 name">
                                                                <strong>Layer Name</strong>{" "}
                                                                <span className="input-error">*</span>
                                                            </label>

                                                            <Field
                                                                onChange={(e) => { setData(e.target.files) }}
                                                                name="layerName"
                                                                placeholder="Enter Category Name"
                                                                className="form-control"
                                                                autoComplete="off"

                                                            />
                                                            {errors.templateName && touched.templateName ? (
                                                                <div className="input-error">{errors.templateName}</div>
                                                            ) : null}
                                                        </div>
                                                    </Col>

                                                    <Col sm={4}>
                                                        <div className=" text-center buttonBrowse" >
                                                            <button className="btn btn-primary" type="submit">
                                                                Add
                                                            </button>
                                                        </div>
                                                    </Col>
                                                </Row> */}
                  {/* <span className="newImages">Layers</span> */}

                  <>
                    <BrowseImages
                    setLoader= {setLoader}
                    loader= {loader}

                      layer={layer}
                      setLayer={setLayer}
                      setBrowseLayers={setBrowseLayers}
                      browseLayers={browseLayers}
                      getBrowseLayers={getBrowseLayers}
                      deleteBrowseLayer={deleteBrowseLayer}
                      editBrowseLayer={editBrowseLayer}
                    />
                  </>
                </div>
              </div>
              {/* </Form> */}
              {/* )} */}
              {/* </Formik> */}
            </CCol>
          </CRow>
        </Container>
      </div>
    </>
  )
}
