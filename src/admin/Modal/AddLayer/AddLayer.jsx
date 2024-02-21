import React, { useEffect, useState ,useRef} from "react";
import style from "./AddLayer.module.css";
// import { useFormik } from "formik";
import { Formik, Field, Form, FormikProvider } from "formik";

import * as Yup from "yup";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import UploadImage from "../UploadImage/UploadImage";
// import { toast } from "react-toastify";
// import { useNftProvider } from "../../context/NftProvider";
// import { ADD_LAYER } from "../../../Api/Api";

export const AddLayer = (props) => {

  const {
    setShow,
    show,
    onSubmit,
    handleClose,
    layerInput
  } = props;

  const [layer, setLayer] = useState("")

  const AddLayerSchema = Yup.object().shape({
    layer: Yup.string()
      .required("Please Enter Layer Name"),

  })
  // useEffect(() => {
  //   setLayer("");
  // }, [show]);

  const handleOnChange = (e) => {
    e.preventDefault();
    // console.log(e.target.value, "valuee");
    setLayer(e.target.value);
  };

  // console.log(layer,"layer--addlayer")
  return (
    <div>
      <Modal onHide={handleClose} show={show} centered>

        <Formik
          initialValues={{ layer: "", }}
          enableReinitialize
          validationSchema={AddLayerSchema}
          onSubmit={onSubmit}
        >

          {({ errors, touched, values }) => (
            <Form>
              <Modal.Header closeButton className={style.addHeader}>
                <h5>Add Layer</h5>
              </Modal.Header>


              <Modal.Body>
                <div>
                  <Field
                    autoComplete="off"
                    autoFocus
                    type="text"
                    className="form-control"
                    placeholder="Add Layer"
                    name="layer"
                  />
                  {errors.layer && touched.layer ? (
                    <div className="text-danger">{errors.layer}</div>
                  ) : null}
                </div>
              </Modal.Body>
              <Modal.Footer className={style.addFooter}>
                <Button variant="light" onClick={handleClose} className={style.Btn}>
                  Cancel
                </Button>
                <Button className={style.addLayerBtn} type="submit">
                  Add Layer
                </Button>
              </Modal.Footer>
            </Form>
          )}

        </Formik>

      </Modal>
    </div>
  );
};

