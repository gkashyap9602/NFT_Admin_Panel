import React, { useEffect, useState } from "react";
import style from "./EditLayer.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import UploadImage from "../UploadImage/UploadImage";
// import { toast } from "react-toastify";
// import { useNftProvider } from "../../context/NftProvider";
// import { ADD_LAYER } from "../../../Api/Api";
import { Form } from "react-bootstrap";
export const EditLayer = (props) => {

  const {
    setShow,
    show,
    onSubmit,
    layerName
  } = props;

  const [layer,setLayer] = useState(layerName)
  const [oldLayer,oldNewLayer] = useState(layerName)


  // console.log(onSubmit,layerName,"onSubmit--layerName")
const handleClose = ()=>{
  setShow(false)
}
  
  const handleOnChange = (e) => {
    e.preventDefault();
    // console.log(e.target.value, "valuee");
    setLayer(e.target.value);
  };
// console.log(oldLayer,"oldLayer")
// console.log(layer,"layer")

  return (
    <div>
      <Modal onHide={handleClose} show={show} centered>
        {/* <Form className={style.form} onSubmit={(e) => onSubmit(e,layer,oldLayer)}> */}
          <Modal.Header closeButton className={style.addHeader}>
            <h5>Edit Layer</h5>
          </Modal.Header>
          <Modal.Body>
            <div>
              <input
                autoComplete="off"
                type="text"
                autoFocus
                className="form-control"
                placeholder="Edit Layer"
                name="layer"
                value={layer}
                onChange={handleOnChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className={style.addFooter}>
            <Button variant="light" onClick={handleClose} className={style.Btn}>
              Cancel
            </Button>
            <Button onClick={(e)=>onSubmit(e,layer,oldLayer)} className={style.addLayerBtn} type="submit">
              Submit
            </Button>
          </Modal.Footer>
        {/* </Form> */}
      </Modal>
    </div>
  );
};

