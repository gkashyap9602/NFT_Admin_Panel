import React, { useEffect, useState } from "react";
import style from "./RenameTemplate.module.css";
// import { useFormik } from "formik";
import { Formik, Field, Form, FormikProvider } from "formik";
import { RENAME_NFT_TEMPLATE } from "admin/Api/api";
import * as Yup from "yup";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
// import UploadImage from "../UploadImage/UploadImage";
// import { toast } from "react-toastify";
// import { useNftProvider } from "../../context/NftProvider";
// import { ADD_LAYER } from "../../../Api/Api";

import { useProvider } from "admin/context/ProviderApp";

export const RenameTemplate = (props) => {

  const {
    setShow,
    show,
    setLoader,
    templateId,
    templateName,
  } = props;

  const {getTemplates} = useProvider()
  const [layer, setLayer] = useState("")

  const [tempName,setTempName] = useState(templateName)
   const [renameTemp,setRenameTemp] = useState(false)

  // useEffect(()=>{
  //   setTempName(templateName)
  // },[renameTemp])

  const RenameTemplateSchema = Yup.object().shape({
    templateName: Yup.string()
      .required("Please Enter Template Name"),

  })
  
  const handleClose = ()=>{
    setShow(false)
  }
  
  //Rename Template Api 
  const renameTemplate = async (_values)=>{
    try {
      setLoader(true)
      // console.log(_values,"_values----rename  temp api side ")
      let user = JSON.parse(localStorage.getItem("authUser"))
       let body = {
        name:_values.templateName,
        id:templateId
        
       }
      const response = await axios.post(`${RENAME_NFT_TEMPLATE}`,body,{
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      console.log(response,"response rename template side ")
      // console.log(response.status,"response status rename template side ")

      if(response.status===200){
        // console.log(getTemplates,"getTemplates-fn")
        getTemplates()
        setTempName(_values.templateName)
        toast.success(response.data.message)
      
      }

    } catch (error) {
      toast.error(error.response ? error.response.data.error : error)

      
    }finally{
      handleClose()
      setLoader(false)
    }
  };
  //ends here 
  const handleOnChange = (e) => {
    e.preventDefault();
    // console.log(e.target.value, "valuee");
    setLayer(e.target.value);
  };

  // console.log(tempName,templateName,"tempName--rename Template side ")
  return (
    <div>
      <Modal onHide={handleClose} show={show} centered>

        <Formik
          initialValues={{ templateName:templateName, }}
          enableReinitialize
          validationSchema={RenameTemplateSchema}
          onSubmit={renameTemplate}
        >

          {({ errors, touched, values }) => (
            <Form>
              {/* <form className={style.form} onSubmit={(e) => {onSubmit(e,layer)}}> */}
              <Modal.Header closeButton className={style.addHeader}>
                <h5>Rename Template </h5>
              </Modal.Header>


              <Modal.Body>
                <div>
                  <Field
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    placeholder="Rename Template"
                    name="templateName"
                    value={values.templateName}
                  // onChange={handleOnChange}
                  />
                  {errors.templateName && touched.templateName ? (
                    <div className="text-danger">{errors.templateName}</div>
                  ) : null}
                </div>
              </Modal.Body>
              <Modal.Footer className={style.addFooter}>
                <Button variant="light" onClick={handleClose} className={style.Btn}>
                  Cancel
                </Button>
                <Button className={style.addLayerBtn} type="submit">
                  Submit
                </Button>
              </Modal.Footer>
            </Form>
          )}

        </Formik>

        {/* </form> */}
      </Modal>
    </div>
  );
};

