import React,{useState,useEffect}from 'react'
import { Row, Col, Container } from "reactstrap"
import { CCard, CCardBody, CCol, CRow, CFormCheck } from "@coreui/react"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { LayerImages } from '../LayerImages/LayerImages'
import { AddLayer } from 'admin/Modal/AddLayer/AddLayer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ADD_BROWSE_CATEGORY ,GET_TEMPLATE_LIST} from 'admin/Api/api'
import { CreateProject } from 'admin/Modal/CreateNft/CreateProject'
import { useProvider } from 'admin/context/ProviderApp'

export const AddNftTemplate = (props) => {
const {templates,templateId,currentTemplate,templateName} = useProvider()

    const SignupSchema = Yup.object().shape({
        layerName: Yup.string().required("Please Enter Category Name"),
      })
    const [data,setData] = useState("")

    // const [layer,setLayer] = useState("")
    const [show,setShow] = useState(false)
    const [layer,setLayer] = useState(false)
    const [createTemplate,setCreateTemplate] = useState(false)

    const handleClose = () => {
        setShow(false);
      };


    const addLayer = async (event,_layerName) => {
        try {
            event.preventDefault()
          console.log(_layerName, "_layerName on addLayer")
    
          let user = JSON.parse(localStorage.getItem("authUser"))
          // console.log(user, "user")
          let response  = await axios.post(`${ADD_BROWSE_CATEGORY}`, {layerName:_layerName}, {
              headers: { 
                Authorization: `Bearer ${user.accessToken}`,
              },
            })
    
            if(response.status ===201){
              console.log(response, "response add layer side ")
              toast.success(response.data?.message)
              setLayer(true)
              handleClose()
            //   setLayer(response.data.data)
            //   setCategoryAdded(true)
            }
    
        } catch (err) {
          console.log(err,"error add category ")
          toast.error(err.response?err.response.data.error : err)
          //   changeApiStatus(false, err.response ? err.response.data.error : err)
        }
      }


    return (
        <>
             <CreateProject show={createTemplate} setShow = {setCreateTemplate} />
            <AddLayer  handleClose = {handleClose} onSubmit = {addLayer} setShow ={setShow} show = {show}/>
            <div className="page-content">
                <Container fluid>

          <div  className="div1 mb-2 d-flex justify-content-between align-items-center">
          <strong style={{fontWeight:"bolder",fontSize: "initial"}}> NftTemplate</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setCreateTemplate(true)
                // setShow(true)
                // navigator(paths.getAddTemplate())
              }}
            >
            {/* {createTemplate} */}
              Create Template
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
                                                <div className="pb-3 text-center">
                                                    <h5 className="mb-0">{templateName}</h5>
                                                </div>
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
                                                    <LayerImages handleClose = {handleClose} onSubmit = {addLayer} layer = {layer} createTemplate = {createTemplate} />
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
