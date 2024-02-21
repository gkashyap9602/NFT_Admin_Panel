import React, { useEffect, useState } from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import style from "./confirmModal.module.css"
import exclamation1 from "../../../assets/exclamation1.png"
import exclamation2 from "../../../assets/exclamation2.png"

export const ConfirmModal = (props) => {
    const { onSubmit,show, setShow,text,template } = props
    // console.log(onSubmit,"onSubmit confirm side ")
    const handleClose = () => {
        setShow(false);
    };
    return (
        <div>
            <Modal onHide={handleClose} show={show} centered>
                {/* <form className={style.form}  onSubmit ={(e) => { 
                    onSubmit(e)
                    handleClose()
                }}> */}
                    <Modal.Header closeButton className={style.addHeader}>
                        <h5>{text}</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='text-center'>
                          <div className={style.confirmModal}>
                            <img src={exclamation2} alt="" />
                             <span className= {style.confirmText}> Are You Sure?</span>

                          </div>
                            {/* <input
                                autoComplete="off"
                                type="text"
                                className="form-control"
                                placeholder="Add Layer"
                                name="layer"
                                value={layer}
                            // onChange={handleOnChange}
                            /> */}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={style.addFooter}>
                    <Button variant="light" onClick={handleClose} className={style.Btn}>
                            Cancel
                        </Button>
                    <Button onClick={(e)=>onSubmit(e)} className={style.confirmBtn} type="submit">
                            Confirm
                        </Button>
                        
                        
                    </Modal.Footer>
                {/* </form> */}
            </Modal>
        </div>
    )
}
