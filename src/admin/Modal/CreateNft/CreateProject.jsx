import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import style from "./CreateProject.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AddLayer } from "../AddLayer/AddLayer";
import { CREATE_NFT_TEMPLATE } from "admin/Api/api";
import { useProvider } from "admin/context/ProviderApp";
import { Formik, Field, Form, FormikProvider } from "formik";
import * as Yup from 'yup'

export const CreateProject = (props) => {
  const { getTemplates,templateName, setTemplateName, templateCreated, setTemplateCreated, templateId, setTemplateId } = useProvider()
  const { show, setShow ,loader,setLoader} = props;

  const CreateProjectSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please Enter Name"),
    size: Yup.string()
      .required("Please Select Size"),
  })

  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");

  useEffect(() => {
    // setName("")
    setHeight("")
    setWidth("")
  }, [templateCreated])

  const handleClose = () => setShow(false);
  // const handleStartProject = () => setCollectionCreated(false);
  // const data = { name, height, width };

  const handleSize = (e) => {
    setHeight(e.target.value);
    setWidth(e.target.value);
  };

  const createTemplate = async (values) => {
    setLoader(true)
    // console.log(values,"values-create project")
    let user = JSON.parse(localStorage.getItem("authUser"))
    // setLoader(true);

    let data = {
      name:values.name,
      height:values.size,
      width:values.size
    }
    await axios.post(CREATE_NFT_TEMPLATE, data, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      },
    })
      .then((res) => {
        // console.log(res.data, "response create template side ")
        // setTemplateCreated(true)
        if(res.status===200){
          toast.success(res.data.message)
          getTemplates()
          handleClose()

        }
        // setTemplateId(res.data.data._id)
        // setShow(true)
        // setTemplateName(res.data.data.name)
        // setCollectionCreated(true)

      })
      .catch((err) => {
        // console.log(err, "Create Template fn side");
        toast.error(err.response ? err.response.data.error : err)
      })
      .finally(()=>{
        setLoader(false)
      })
  };

  // console.log(height,name,width,"height,name,width--create Template side ")
  return (
    <div>
      <Modal centered className="CreateNft" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Template</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: "", height: "", width: "" }}
          enableReinitialize
          validationSchema={CreateProjectSchema}
          onSubmit={createTemplate}
        >
          {({errors, touched, values}) => (

            <Form>

              <Modal.Body className={style.startProjectBody}>
                <div>
                  <Field
                    autoComplete="off"
                    type="text"
                    // value={name}
                    autoFocus
                    name="name"
                    // onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Template Name"
                    className="form-control"
                  />
                   {errors.name && touched.name ? (
                <div className="text-danger">{errors.name}</div>
              ) : null}
                </div>
               

                <div>
                  <Field
                    name="size"
                    // onChange={(e) => handleSize(e)}
                    // value={height}
                    className={style.selectInput}
                    id=""
                    as="select"
                  >
                    <option value="" label="Select Size" />
                    <option value="512"> 512px * 512px </option>
                    <option value="1024"> 1024px * 1024px </option>
                  </Field>
                  {errors.size && touched.size ? (
                <div className="text-danger">{errors.size}</div>
              ) : null}
                </div>
               
                <Modal.Footer className={style.startProjectFooter}>
                  <Button
                    variant="light"
                    onClick={handleClose}
                    className={style.Btn}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    // onClick={() => {
                    //   createTemplate()
                    // }}
                    className={style.createTemplateBtn}
                  >
                    Create
                  </Button>
                </Modal.Footer>
              </Modal.Body>
              
            </Form>
          )}


        </Formik>

      </Modal>

    </div>
  );
};

